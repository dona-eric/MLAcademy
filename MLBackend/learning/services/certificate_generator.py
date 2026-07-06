"""
Service de génération de certificats PDF pour MLAcademy (F-09).
Génère un certificat premium avec QR code de vérification.
"""
import io
import os
import qrcode
from datetime import datetime

from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import cm, mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


# Couleurs du thème MLAcademy
DARK_BG = HexColor("#0F172A")
ACCENT_BLUE = HexColor("#3B82F6")
ACCENT_PURPLE = HexColor("#8B5CF6")
GOLD = HexColor("#F59E0B")
WHITE = HexColor("#FFFFFF")
LIGHT_GRAY = HexColor("#94A3B8")
BORDER_COLOR = HexColor("#1E293B")


def generate_certificate_pdf(certificate) -> io.BytesIO:
    """
    Génère un certificat PDF premium pour un Certificate donné.
    Retourne un BytesIO contenant le fichier PDF.
    """
    buffer = io.BytesIO()
    width, height = landscape(A4)  # 842 x 595 points

    c = canvas.Canvas(buffer, pagesize=landscape(A4))
    c.setTitle(f"Certificat MLAcademy - {certificate.certificate_id}")

    # Fond sombre
    c.setFillColor(DARK_BG)
    c.rect(0, 0, width, height, fill=True, stroke=False)

    # Bordure dorée extérieure
    c.setStrokeColor(GOLD)
    c.setLineWidth(3)
    c.rect(15, 15, width - 30, height - 30, fill=False, stroke=True)

    # ─── Bordure intérieure fine ───
    c.setStrokeColor(ACCENT_BLUE)
    c.setLineWidth(0.5)
    c.rect(25, 25, width - 50, height - 50, fill=False, stroke=True)

    # ─── Lignes décoratives en haut ───
    c.setStrokeColor(ACCENT_PURPLE)
    c.setLineWidth(2)
    c.line(width / 2 - 120, height - 80, width / 2 + 120, height - 80)

    # ─── Logo / Titre de la plateforme ───
    c.setFillColor(ACCENT_BLUE)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(width / 2, height - 70, "MLACADEMY")

    # ─── Sous-titre ───
    c.setFillColor(LIGHT_GRAY)
    c.setFont("Helvetica", 9)
    c.drawCentredString(width / 2, height - 85, "Plateforme de Formation en Data Science & Machine Learning")

    # ─── Titre principal ───
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(width / 2, height - 145, "CERTIFICAT")

    c.setFillColor(WHITE)
    c.setFont("Helvetica", 14)
    c.drawCentredString(width / 2, height - 170, "DE COMPLÉTION")

    # ─── Ligne décorative ───
    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.line(width / 2 - 80, height - 185, width / 2 + 80, height - 185)

    # ─── "Décerné à" ───
    c.setFillColor(LIGHT_GRAY)
    c.setFont("Helvetica", 12)
    c.drawCentredString(width / 2, height - 215, "Ce certificat est décerné à")

    # ─── Nom de l'étudiant ───
    student_name = certificate.user.get_full_name()
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(width / 2, height - 255, student_name)

    # ─── Ligne sous le nom ───
    c.setStrokeColor(ACCENT_BLUE)
    c.setLineWidth(0.5)
    name_width = c.stringWidth(student_name, "Helvetica-Bold", 28)
    c.line(
        width / 2 - name_width / 2 - 20, height - 265,
        width / 2 + name_width / 2 + 20, height - 265,
    )

    # "Pour avoir complété avec succès"
    c.setFillColor(LIGHT_GRAY)
    c.setFont("Helvetica", 11)
    c.drawCentredString(width / 2, height - 295, "pour avoir complété avec succès le parcours")

    # ─── Nom du cours ───
    c.setFillColor(ACCENT_BLUE)
    c.setFont("Helvetica-Bold", 20)
    course_title = certificate.course.title
    # Tronquer si trop long
    if len(course_title) > 50:
        course_title = course_title[:47] + "..."
    c.drawCentredString(width / 2, height - 325, course_title)

    # ─── Score final ───
    if certificate.final_score > 0:
        c.setFillColor(GOLD)
        c.setFont("Helvetica-Bold", 14)
        c.drawCentredString(width / 2, height - 355, f"Score final : {certificate.final_score}/100")

    # ─── Date d'émission ───
    c.setFillColor(LIGHT_GRAY)
    c.setFont("Helvetica", 10)
    issued_date = certificate.issued_at.strftime("%d %B %Y")
    c.drawCentredString(width / 2, height - 385, f"Délivré le {issued_date}")

    # ─── Identifiant du certificat ───
    c.setFillColor(LIGHT_GRAY)
    c.setFont("Helvetica", 8)
    c.drawCentredString(width / 2, height - 400, f"ID : {certificate.certificate_id}")

    # ─── QR Code de vérification ───
    verification_url = _get_verification_url(certificate)
    qr_img = _generate_qr_code(verification_url)

    # Positionner le QR code en bas à droite
    qr_size = 80
    qr_x = width - qr_size - 50
    qr_y = 40
    c.drawInlineImage(qr_img, qr_x, qr_y, width=qr_size, height=qr_size)

    c.setFillColor(LIGHT_GRAY)
    c.setFont("Helvetica", 7)
    c.drawCentredString(qr_x + qr_size / 2, qr_y - 10, "Scanner pour vérifier")

    # ─── Signature / Pied de page ───
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.5)
    c.line(60, 70, 200, 70)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(130, 55, "MLAcademy")
    c.setFillColor(LIGHT_GRAY)
    c.setFont("Helvetica", 8)
    c.drawCentredString(130, 43, "Directeur de la Formation")

    # ─── Mention légale ───
    c.setFillColor(HexColor("#475569"))
    c.setFont("Helvetica", 6)
    c.drawCentredString(
        width / 2, 20,
        f"Ce certificat est vérifiable en ligne à l'adresse : {verification_url}"
    )

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer


def _get_verification_url(certificate) -> str:
    """Construit l'URL publique de vérification du certificat."""
    base_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    return f"{base_url}/verify/{certificate.certificate_id}"


def _generate_qr_code(data: str) -> io.BytesIO:
    """Génère un QR code en mémoire (PNG)."""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=1,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#3B82F6", back_color="#0F172A")
    img_buffer = io.BytesIO()
    img.save(img_buffer, format="PNG")
    img_buffer.seek(0)
    return img_buffer
