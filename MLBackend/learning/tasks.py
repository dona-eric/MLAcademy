import logging
from celery import shared_task
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from mjml import mjml2html

logger = logging.getLogger(__name__)

def compile_mjml_template(template_name, context):
    """
    Rend un template MJML avec les variables de contexte Django,
    puis le compile en HTML standard via mjml-python.
    """
    try:
        # Render Django template (avec les tags et variables)
        rendered_mjml = render_to_string(f"emails/{template_name}", context)
        # Compilation MJML -> HTML
        html_result = mjml2html(rendered_mjml)
        return html_result.html
    except Exception as e:
        logger.error(f"Erreur lors de la compilation MJML de {template_name}: {e}")
        return ""


@shared_task
def send_submission_received_email(user_email, student_name, project_title, dashboard_url):
    """Accusé de réception après la soumission d'un projet."""
    subject = "Accusé de réception de votre projet - MLAcademy"
    html_content = compile_mjml_template(
        "submission_received.mjml",
        {
            "student_name": student_name,
            "project_title": project_title,
            "dashboard_url": dashboard_url
        }
    )
    
    send_mail(
        subject=subject,
        message="Nous avons bien reçu votre projet. Connectez-vous pour voir les détails.",
        from_email="no-reply@mlacademy.com",
        recipient_list=[user_email],
        html_message=html_content
    )

@shared_task
def send_new_feedback_email(user_email, student_name, project_title, review_url):
    """Notification d'une nouvelle évaluation (feedback)."""
    subject = f"Nouvelle évaluation sur votre projet: {project_title}"
    html_content = compile_mjml_template(
        "new_feedback.mjml",
        {
            "student_name": student_name,
            "project_title": project_title,
            "review_url": review_url
        }
    )
    
    send_mail(
        subject=subject,
        message="Un évaluateur a laissé un commentaire sur votre projet. Consultez-le sur MLAcademy.",
        from_email="no-reply@mlacademy.com",
        recipient_list=[user_email],
        html_message=html_content
    )

@shared_task
def send_certification_success_email(user_email, student_name, project_title, final_score, linkedin_url, certificate_url):
    """Notification de succès et de certification (Dopamine)."""
    subject = "Félicitations ! Vous êtes certifié(e) 🎓"
    html_content = compile_mjml_template(
        "certification_success.mjml",
        {
            "student_name": student_name,
            "project_title": project_title,
            "final_score": final_score,
            "linkedin_url": linkedin_url,
            "certificate_url": certificate_url
        }
    )
    
    send_mail(
        subject=subject,
        message=f"Félicitations {student_name} ! Vous avez réussi le projet avec un score de {final_score}%.",
        from_email="no-reply@mlacademy.com",
        recipient_list=[user_email],
        html_message=html_content
    )

@shared_task
def send_growth_mindset_email(user_email, student_name, project_title, review_url):
    """Notification d'échec incitant à l'itération (Growth Mindset)."""
    subject = "Retours sur votre projet - Des ajustements sont nécessaires"
    html_content = compile_mjml_template(
        "growth_mindset.mjml",
        {
            "student_name": student_name,
            "project_title": project_title,
            "review_url": review_url
        }
    )
    
    send_mail(
        subject=subject,
        message="Votre projet nécessite des ajustements. Consultez les commentaires de l'évaluateur et soumettez une nouvelle version !",
        from_email="no-reply@mlacademy.com",
        recipient_list=[user_email],
        html_message=html_content
    )
