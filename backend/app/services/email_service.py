import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List

# Read directly from os.getenv. 
# We can also read from DB if user wants a DB-backed settings, but standard approaches do env first, then override.
def get_email_settings(db_session=None):
    # If there's an EmailSettings model, fetch it from db_session
    # Fallback to env vars.
    return {
        "smtp_host": os.getenv("SMTP_HOST", "smtp.gmail.com"),
        "smtp_port": int(os.getenv("SMTP_PORT", "587")),
        "smtp_user": os.getenv("SMTP_USER", ""),
        "smtp_password": os.getenv("SMTP_PASSWORD", ""),
        "from_email": os.getenv("EMAILS_FROM_EMAIL", "info@4kahaban.com"),
    }

def send_email(to_email: str, subject: str, html_content: str, db_session=None):
    settings = get_email_settings(db_session)
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings["from_email"]
    msg["To"] = to_email

    part = MIMEText(html_content, "html")
    msg.attach(part)

    try:
        server = smtplib.SMTP(settings["smtp_host"], settings["smtp_port"])
        server.starttls()
        server.login(settings["smtp_user"], settings["smtp_password"])
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_reset_password_email(email_to: str, token: str):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    reset_link = f"{frontend_url}/reset-password?token={token}"
    subject = "Password Reset Request"
    html_content = f"""
    <p>We received a request to reset your password.</p>
    <p>Please click the link below to reset it:</p>
    <a href="{reset_link}">{reset_link}</a>
    """
    return send_email(email_to, subject, html_content)

def send_vaccine_notification(admin_email: str, animal_name: str, vaccine_name: str, date_due: str):
    subject = f"Vaccination Reminder: {animal_name}"
    html_content = f"""
    <h3>Vaccination Due Reminder</h3>
    <p>Animal: <strong>{animal_name}</strong></p>
    <p>Vaccine: <strong>{vaccine_name}</strong></p>
    <p>Due Date: <strong>{date_due}</strong></p>
    """
    return send_email(admin_email, subject, html_content)
