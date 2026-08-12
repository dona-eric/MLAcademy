import io
import os
import qrcode
import logging
from django.conf import settings
from django.core.files.base import ContentFile
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing, Rect

logger = logging.getLogger(__name__)

def generate_qr_code_image(verify_url):
    """Génère une image BytesIO du QR Code redirigeant vers l'URL de vérification publique."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=6,
        border=2,
    )
    qr.add_data(verify_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#0F172A", back_color="#FFFFFF")
    img_buffer = io.BytesIO()
    img.save(img_buffer, format="PNG")
    img_buffer.seek(0)
    return img_buffer

def build_certificate_pdf(certificate):
    """
    Génère un PDF vectoriel Haute Définition (A4 Paysage) pour un diplôme MLAcademy.
    Contient le cadre d'honneur, le sceau, le QR Code, la signature et l'empreinte SHA-256.
    """
    try:
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=landscape(A4))
        width, height = landscape(A4)

        # ----------------------------------------------------
        # 1. Couleurs du thème officiel MLAcademy
        # ----------------------------------------------------
        PRIMARY_NAVY = colors.HexColor("#051424")
        DARK_SLATE = colors.HexColor("#0B192C")
        GOLD_ACCENT = colors.HexColor("#D4AF37")
        GOLD_LIGHT = colors.HexColor("#F59E0B")
        CYAN_ACCENT = colors.HexColor("#00D2FF")
        TEXT_DARK = colors.HexColor("#0F172A")
        TEXT_MUTED = colors.HexColor("#475569")

        # ----------------------------------------------------
        # 2. Arrière-plan & Bordure d'honneur
        # ----------------------------------------------------
        # Fond général
        c.setFillColor(colors.HexColor("#FAFAFC"))
        c.rect(0, 0, width, height, fill=1, stroke=0)

        # Bordure extérieure Navy
        c.setStrokeColor(PRIMARY_NAVY)
        c.setLineWidth(12)
        c.rect(20, 20, width - 40, height - 40, fill=0, stroke=1)

        # Bordure intérieure Or
        c.setStrokeColor(GOLD_ACCENT)
        c.setLineWidth(2)
        c.rect(32, 32, width - 64, height - 64, fill=0, stroke=1)

        # Motifs d'angles décoratifs
        corner_size = 20
        corners = [
            (32, 32),
            (width - 32, 32),
            (32, height - 32),
            (width - 32, height - 32)
        ]
        c.setFillColor(GOLD_ACCENT)
        for cx, cy in corners:
            c.circle(cx, cy, 4, fill=1, stroke=0)

        # ----------------------------------------------------
        # 3. En-tête Institutionnel
        # ----------------------------------------------------
        c.setFont("Helvetica-Bold", 12)
        c.setFillColor(PRIMARY_NAVY)
        c.drawCentredString(width / 2.0, height - 75, "MLACADEMY — PLATFORME D'EXCELLENCE EN INTELLIGENCE ARTIFICIELLE")

        c.setStrokeColor(GOLD_ACCENT)
        c.setLineWidth(1)
        c.line(width / 2.0 - 150, height - 85, width / 2.0 + 150, height - 85)

        # Titre du Diplôme
        is_cert = certificate.cert_type == 'path_certification'
        title = "CERTIFICATION PROFESSIONNELLE" if is_cert else "CERTIFICAT D'ACCOMPLISSEMENT"
        
        c.setFont("Helvetica-Bold", 26)
        c.setFillColor(PRIMARY_NAVY)
        c.drawCentredString(width / 2.0, height - 130, title)

        c.setFont("Helvetica", 12)
        c.setFillColor(TEXT_MUTED)
        c.drawCentredString(width / 2.0, height - 160, "Le présent document officiel atteste que")

        # ----------------------------------------------------
        # 4. Récipiendaire & Intitulé du Cours / Parcours
        # ----------------------------------------------------
        user_name = certificate.user.get_full_name() or certificate.user.username
        c.setFont("Helvetica-Bold", 32)
        c.setFillColor(GOLD_ACCENT)
        c.drawCentredString(width / 2.0, height - 215, user_name.upper())

        # Ligne sous le nom
        c.setStrokeColor(colors.HexColor("#CBD5E1"))
        c.setLineWidth(0.5)
        c.line(width / 2.0 - 200, height - 230, width / 2.0 + 200, height - 230)

        c.setFont("Helvetica", 12)
        c.setFillColor(TEXT_MUTED)
        c.drawCentredString(width / 2.0, height - 255, "a validé avec succès le programme d'études et les projets pratiques de :")

        # Intitulé du programme
        program_title = "Programme de Spécialisation IA"
        if certificate.learning_path and hasattr(certificate.learning_path, 'title'):
            program_title = certificate.learning_path.title
        elif certificate.course and hasattr(certificate.course, 'title'):
            program_title = certificate.course.title

        c.setFont("Helvetica-Bold", 20)
        c.setFillColor(PRIMARY_NAVY)
        c.drawCentredString(width / 2.0, height - 295, f"« {program_title} »")

        # Score & Statut
        score_text = f"Score obtenu : {certificate.final_score}% | Statut : Identité & Compétences Vérifiées"
        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(DARK_SLATE)
        c.drawCentredString(width / 2.0, height - 325, score_text)

        # ----------------------------------------------------
        # 5. Pied de Page : Signatures, Sceau & QR Code
        # ----------------------------------------------------
        # Zone Gauche : Signature Officielle
        c.setFont("Helvetica-Bold", 11)
        c.setFillColor(PRIMARY_NAVY)
        c.drawString(70, 130, "Direction Académique")
        c.setFont("Helvetica-Oblique", 9)
        c.setFillColor(TEXT_MUTED)
        c.drawString(70, 115, "MLAcademy Board of Examiners")

        # Ligne de signature
        c.setStrokeColor(PRIMARY_NAVY)
        c.setLineWidth(1)
        c.line(70, 95, 230, 95)
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(GOLD_ACCENT)
        c.drawString(70, 80, "Sceau Officiel d'Authenticité")

        # Zone Droite : QR Code de Vérification Publique
        frontend_url = getattr(settings, 'FRONTEND_URL', 'https://mlacademie.vercel.app')
        verify_url = f"{frontend_url}/verify/{certificate.certificate_id}"
        qr_img_buffer = generate_qr_code_image(verify_url)

        from reportlab.lib.utils import ImageReader
        qr_image = ImageReader(qr_img_buffer)
        c.drawImage(qr_image, width - 150, 65, width=80, height=80)

        c.setFont("Helvetica", 8)
        c.setFillColor(TEXT_MUTED)
        c.drawRightString(width - 160, 115, "Scannez pour vérifier")
        c.drawRightString(width - 160, 100, "l'authenticité en ligne")

        # ----------------------------------------------------
        # 6. Identifiants & Empreinte SHA-256
        # ----------------------------------------------------
        issued_date_str = certificate.issued_at.strftime("%d/%m/%Y") if certificate.issued_at else "06/08/2026"
        c.setFont("Helvetica-Bold", 9)
        c.setFillColor(PRIMARY_NAVY)
        c.drawCentredString(width / 2.0, 75, f"Délivré le : {issued_date_str}   |   Identifiant unique : {certificate.certificate_id}")

        hash_str = certificate.verification_hash or "SHA256-PENDING"
        c.setFont("Helvetica", 8)
        c.setFillColor(TEXT_MUTED)
        c.drawCentredString(width / 2.0, 58, f"Empreinte Cryptographique SHA-256 : {hash_str}")

        # Finalisation et enregistrement du PDF
        c.showPage()
        c.save()

        buffer.seek(0)
        pdf_filename = f"{certificate.certificate_id}.pdf"
        certificate.pdf_file.save(pdf_filename, ContentFile(buffer.getvalue()), save=True)
        logger.info(f"✅ Certificat PDF généré avec succès pour {certificate.certificate_id}")
        return True

    except Exception as e:
        logger.error(f"❌ Erreur lors de la génération du PDF du certificat {certificate.certificate_id} : {e}")
        return False
