import logging
from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from mjml import mjml2html

logger = logging.getLogger(__name__)

def compile_mjml_template(template_name, context):
    """Rend un template MJML et le compile en HTML standard. Retourne None si échec."""
    try:
        rendered_mjml = render_to_string(f"emails/{template_name}", context)
        html_result = mjml2html(rendered_mjml)
        return html_result.html
    except Exception as e:
        logger.error(f"Erreur critique lors de la compilation MJML de {template_name}: {e}", exc_info=True)
        return None

def get_full_frontend_url(route=""):
    """Construit proprement l'URL absolue vers le client web sans doublons de slashes."""
    base_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000').rstrip('/')
    if route:
        return f"{base_url}/{route.lstrip('/')}"
    return base_url


@shared_task
def send_submission_received_email(user_email, student_name, project_title, dashboard_url):
    html_content = compile_mjml_template(
        "submission_received.mjml",
        {
            "student_name": student_name,
            "project_title": project_title,
            "dashboard_url": get_full_frontend_url(dashboard_url)
        }
    )
    if not html_content:
        return False

    send_mail(
        subject="Accusé de réception de votre projet - MLAcademy",
        message="Nous avons bien reçu votre projet. Connectez-vous pour voir les détails.",
        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@mlacademy.com'),
        recipient_list=[user_email],
        html_message=html_content
    )

@shared_task
def send_new_feedback_email(user_email, student_name, project_title, review_url):
    html_content = compile_mjml_template(
        "new_feedback.mjml",
        {
            "student_name": student_name,
            "project_title": project_title,
            "review_url": get_full_frontend_url(review_url)
        }
    )
    if not html_content:
        return False

    send_mail(
        subject=f"Nouvelle évaluation sur votre projet: {project_title}",
        message="Un évaluateur a laissé un commentaire sur votre projet. Consultez-le sur MLAcademy.",
        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@mlacademy.com'),
        recipient_list=[user_email],
        html_message=html_content
    )

@shared_task
def send_certification_success_email(user_email, student_name, project_title, final_score, linkedin_url, certificate_url):
    html_content = compile_mjml_template(
        "certification_success.mjml",
        {
            "student_name": student_name,
            "project_title": project_title,
            "final_score": final_score,
            "linkedin_url": linkedin_url,
            "certificate_url": get_full_frontend_url(certificate_url)
        }
    )
    if not html_content:
        return False

    send_mail(
        subject="Félicitations ! Vous êtes certifié(e) 🎓",
        message=f"Félicitations {student_name} ! Vous avez réussi le projet avec un score de {final_score}%.",
        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@mlacademy.com'),
        recipient_list=[user_email],
        html_message=html_content
    )

@shared_task
def send_growth_mindset_email(user_email, student_name, project_title, review_url):
    html_content = compile_mjml_template(
        "growth_mindset.mjml",
        {
            "student_name": student_name,
            "project_title": project_title,
            "review_url": get_full_frontend_url(review_url)
        }
    )
    if not html_content:
        return False

    send_mail(
        subject="Retours sur votre projet - Des ajustements sont nécessaires",
        message="Votre projet nécessite des ajustements. Consultez les commentaires de l'évaluateur et réitérez !",
        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'no-reply@mlacademy.com'),
        recipient_list=[user_email],
        html_message=html_content
    )

@shared_task
def auto_grade_project_submission(submission_id):
    """
    Tâche asynchrone pour auto-évaluer un projet en utilisant MLSandbox.
    """
    from learning.models import ProjectSubmission
    import httpx
    import os
    
    try:
        submission = ProjectSubmission.objects.select_related('project').get(id=submission_id)
    except ProjectSubmission.DoesNotExist:
        logger.error(f"Soumission {submission_id} introuvable pour l'auto-grading.")
        return False

    project = submission.project
    student_code = submission.code_content
    solution_code = project.solution_code
    
    # On assemble le code de l'étudiant avec le code de test de l'instructeur
    # (En pratique, l'instructeur écrit des assert ou des vérifications dans solution_code)
    full_code = f"{student_code}\n\n# --- TESTS INSTRUCTEUR ---\n{solution_code}"
    
    from django.conf import settings
    sandbox_url = getattr(settings, "SANDBOX_URL", "http://localhost:8000/execute")
    
    try:
        with httpx.Client(timeout=30.0) as client:
            response = client.post(
                sandbox_url,
                json={"source_code": full_code, "language_id": 71}, # 71 = Python sur Judge0
            )
            result = response.json()
            
        if response.status_code == 200 and result.get("status", {}).get("id") == 3:
            # ID 3 = Accepted sur Judge0
            submission.status = 'approved'
            logger.info(f"Auto-grading réussi pour la soumission {submission_id}.")
        else:
            submission.status = 'rejected'
            logger.warning(f"Auto-grading échoué pour la soumission {submission_id}. Résultat: {result}")
            
        submission.save(update_fields=['status'])
        
        # Si approuvé, la sauvegarde déclenchera la mise à jour de la progression globale
        # (trigger_certification_success, etc. gérés dans la méthode save() de ProjectSubmission)
        
        return True
        
    except Exception as e:
        logger.error(f"Erreur de communication avec MLSandbox pour la soumission {submission_id} : {e}")
        # En cas d'erreur de la Sandbox, on laisse en 'pending' pour correction manuelle
        return False