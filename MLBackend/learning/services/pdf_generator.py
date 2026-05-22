import os
from io import BytesIO
from django.core.files.base import ContentFile
from django.conf import settings
from reportlab.lib.pagesizes import landscape, A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import qrcode
from PIL import Image

def generate_certificate_pdf(certificate):
    """
    Génère un PDF pour le certificat et l'enregistre dans le champ pdf_file du modèle Certificate.
    """
    buffer = BytesIO()
    
    # Format Paysage A4
    c = canvas.Canvas(buffer, pagesize=landscape(A4))
    width, height = landscape(A4)
    
    # 1. Dessiner le fond (Couleur sombre ou image)
    # Fond sombre avec bordure
    c.setFillColorRGB(0.04, 0.05, 0.08) # #090C14 background
    c.rect(0, 0, width, height, fill=1)
    
    c.setStrokeColorRGB(0.3, 0.27, 0.9) # Indigo border
    c.setLineWidth(10)
    c.rect(20, 20, width - 40, height - 40)
    
    c.setStrokeColorRGB(0.1, 0.8, 1.0) # Cyan inner border
    c.setLineWidth(2)
    c.rect(35, 35, width - 70, height - 70)

    # 2. Logo ou Texte Principal
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 40)
    c.drawCentredString(width / 2.0, height - 120, "CERTIFICAT DE RÉUSSITE")
    
    c.setFillColorRGB(0.6, 0.6, 0.6)
    c.setFont("Helvetica", 16)
    c.drawCentredString(width / 2.0, height - 160, "Ce document certifie formellement que")
    
    # 3. Nom de l'étudiant
    student_name = certificate.user.get_full_name() or certificate.user.email
    c.setFillColorRGB(0.1, 0.8, 1.0) # Cyan
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(width / 2.0, height - 230, student_name.upper())
    
    # 4. Description
    c.setFillColorRGB(0.6, 0.6, 0.6)
    c.setFont("Helvetica", 16)
    c.drawCentredString(width / 2.0, height - 280, "a complété avec succès toutes les exigences du parcours :")
    
    # 5. Nom du cours / parcours
    target_name = certificate.learning_path.title if certificate.learning_path else certificate.course.title
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(width / 2.0, height - 330, target_name)
    
    # 6. Date et Score
    c.setFillColorRGB(0.8, 0.8, 0.8)
    c.setFont("Helvetica", 14)
    date_str = certificate.issued_at.strftime("%d %B %Y")
    c.drawCentredString(width / 2.0, height - 380, f"Délivré le {date_str} • Score final : {certificate.final_score}%")
    
    # 7. Identifiant unique
    c.setFont("Helvetica", 10)
    c.setFillColorRGB(0.5, 0.5, 0.5)
    c.drawString(60, 60, f"ID Certificat : {certificate.certificate_id}")
    
    # 8. Signature (Simulée)
    c.setStrokeColorRGB(1, 1, 1)
    c.setLineWidth(1)
    c.line(width - 250, 100, width - 60, 100)
    c.drawString(width - 200, 80, "L'Équipe MLAcademy")
    
    # 9. QR Code de Vérification
    verify_url = f"{settings.FRONTEND_URL}/certificat/{certificate.certificate_id}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=4,
        border=1,
    )
    qr.add_data(verify_url)
    qr.make(fit=True)
    img_qr = qr.make_image(fill_color="black", back_color="white")
    
    # Sauvegarder QR dans un fichier temp pour l'inclure
    import tempfile
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp_qr:
        img_qr.save(tmp_qr.name)
        c.drawImage(tmp_qr.name, width / 2.0 - 40, 80, width=80, height=80)
    
    os.unlink(tmp_qr.name)

    c.showPage()
    c.save()
    
    buffer.seek(0)
    file_name = f"{certificate.certificate_id}.pdf"
    certificate.pdf_file.save(file_name, ContentFile(buffer.read()), save=True)
    buffer.close()
    
    return certificate
