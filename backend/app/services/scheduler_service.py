from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime, timedelta
import os
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.all_models import Vaccine, Animal
from app.services.email_service import send_vaccine_notification

scheduler = BackgroundScheduler()

def check_upcoming_vaccinations():
    """
    Checks for vaccines due in the next 7 days and sends email to admin
    """
    db = SessionLocal()
    try:
        # Get admin emails
        # For simplicity, could read from .env if we have only 1 main admin, 
        # or load all admin users from DB
        admin_email = os.getenv("SMTP_USER", "admin@4kahaban.com")
        
        target_date = datetime.utcnow().date() + timedelta(days=7)
        upcoming_vaccines = db.query(Vaccine)\
            .join(Animal)\
            .filter(Vaccine.next_due_date <= target_date)\
            .filter(Vaccine.notified_admin == False)\
            .all()
            
        for vac in upcoming_vaccines:
            animal_name = vac.animal.name
            success = send_vaccine_notification(admin_email, animal_name, vac.name, str(vac.next_due_date))
            if success:
                vac.notified_admin = True
                db.commit()
    except Exception as e:
        print(f"Error checking vaccinations: {e}")
    finally:
        db.close()

def start_scheduler():
    scheduler.add_job(
        check_upcoming_vaccinations,
        CronTrigger(hour=9, minute=0), # Run every day at 09:00 AM
        id='vaccine_check'
    )
    scheduler.start()
