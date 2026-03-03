from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.dependencies import get_db, get_current_admin_user
from app.models.all_models import Hospital, Doctor, News, User, Album, GalleryPhoto
from app.schemas.all_schemas import (
    HospitalResponse, DoctorResponse, NewsResponse, GalleryPhotoResponse,
    AlbumCreate, AlbumResponse,
    HospitalCreate, HospitalUpdate, DoctorCreate, DoctorUpdate
)

router = APIRouter()

@router.get("/hospitals", response_model=List[HospitalResponse])
def get_hospitals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Hospital).offset(skip).limit(limit).all()

@router.get("/doctors", response_model=List[DoctorResponse])
def get_doctors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Doctor).offset(skip).limit(limit).all()

@router.get("/news", response_model=List[NewsResponse])
def get_news(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    # Order by date_posted desc
    return db.query(News).order_by(News.date_posted.desc()).offset(skip).limit(limit).all()

@router.get("/gallery", response_model=List[GalleryPhotoResponse])
def get_gallery_items(album_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(GalleryPhoto)
    if album_id:
        query = query.filter(GalleryPhoto.album_id == album_id)
    return query.order_by(GalleryPhoto.created_at.desc()).offset(skip).limit(limit).all()

@router.get("/albums", response_model=List[AlbumResponse])
def get_albums(db: Session = Depends(get_db)):
    return db.query(Album).all()

# Managed Routes (Admin Only)
@router.post("/hospitals", response_model=HospitalResponse)
def create_hospital(hospital_in: HospitalCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    new_hosp = Hospital(**hospital_in.dict())
    db.add(new_hosp)
    db.commit()
    db.refresh(new_hosp)
    return new_hosp

@router.put("/hospitals/{hospital_id}", response_model=HospitalResponse)
def update_hospital(hospital_id: int, hospital_in: HospitalUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    hosp = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hosp:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    update_data = hospital_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        if hasattr(hosp, key):
            setattr(hosp, key, value)
    
    db.commit()
    db.refresh(hosp)
    return hosp

@router.delete("/hospitals/{hospital_id}", response_model=dict)
def delete_hospital(hospital_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    hosp = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hosp:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    db.delete(hosp)
    db.commit()
    return {"msg": "Hospital deleted"}

@router.post("/doctors", response_model=DoctorResponse)
def create_doctor(doctor_in: DoctorCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    new_doc = Doctor(**doctor_in.dict())
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.put("/doctors/{doctor_id}", response_model=DoctorResponse)
def update_doctor(doctor_id: int, doctor_in: DoctorUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    for key, value in doctor_in.dict(exclude_unset=True).items():
        setattr(doc, key, value)
    
    db.commit()
    db.refresh(doc)
    return doc

@router.delete("/doctors/{doctor_id}", response_model=dict)
def delete_doctor(doctor_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    doc = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    db.delete(doc)
    db.commit()
    return {"msg": "Doctor deleted"}

@router.post("/news", response_model=NewsResponse)
def create_news(
    title: str = Form(...), 
    content: str = Form(...), 
    event_period: Optional[str] = Form(None),
    image: UploadFile = File(None), 
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin_user)
):
    image_url = None
    if image:
        from app.services.image_service import process_and_save_image
        import uuid
        filename = f"news_{uuid.uuid4().hex}.jpg"
        image_url = process_and_save_image(image, "news", filename)
        
    new_news = News(title=title, content=content, image_url=image_url, event_period=event_period)
    db.add(new_news)
    db.commit()
    db.refresh(new_news)
    return new_news

@router.put("/news/{news_id}", response_model=NewsResponse)
def update_news(
    news_id: int, 
    title: str = Form(None), 
    content: str = Form(None), 
    event_period: Optional[str] = Form(None),
    image: UploadFile = File(None), 
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin_user)
):
    item = db.query(News).filter(News.id == news_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="News not found")
        
    if title is not None: item.title = title
    if content is not None: item.content = content
    if event_period is not None: item.event_period = event_period
    if image:
        from app.services.image_service import process_and_save_image
        import uuid
        filename = f"news_{uuid.uuid4().hex}.jpg"
        item.image_url = process_and_save_image(image, "news", filename)
        
    db.commit()
    db.refresh(item)
    return item

@router.delete("/news/{news_id}", response_model=dict)
def delete_news(news_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    item = db.query(News).filter(News.id == news_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="News not found")
    db.delete(item)
    db.commit()
    return {"msg": "News deleted"}

@router.post("/albums", response_model=AlbumResponse)
def create_album(album_in: AlbumCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    new_album = Album(**album_in.dict())
    db.add(new_album)
    db.commit()
    db.refresh(new_album)
    return new_album

@router.post("/gallery", response_model=List[GalleryPhotoResponse])
def upload_gallery_photos(
    album_id: Optional[int] = Form(None), 
    caption: Optional[str] = Form(None), 
    images: List[UploadFile] = File(...), 
    db: Session = Depends(get_db), 
    current_admin: User = Depends(get_current_admin_user)
):
    from app.services.image_service import process_and_save_image
    import uuid
    
    uploaded_photos = []
    for image in images:
        if not image.content_type.startswith("image/"):
            continue # Skip non-images
            
        filename = f"gallery_{uuid.uuid4().hex}.jpg"
        image_url = process_and_save_image(image, "gallery", filename)
        
        new_photo = GalleryPhoto(image_url=image_url, caption=caption, album_id=album_id)
        db.add(new_photo)
        uploaded_photos.append(new_photo)
        
    db.commit()
    for photo in uploaded_photos:
        db.refresh(photo)
        
    return uploaded_photos

@router.delete("/gallery/{photo_id}", response_model=dict)
def delete_gallery_photo(photo_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    item = db.query(GalleryPhoto).filter(GalleryPhoto.id == photo_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Photo not found")
    db.delete(item)
    db.commit()
    return {"msg": "Photo deleted"}

@router.get("/vaccinations/upcoming", response_model=List[dict])
def get_upcoming_vaccinations(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    from app.models.all_models import Vaccine, Animal
    from datetime import date, timedelta
    
    # Range: from 30 days ago to 180 days (6 months) in the future to give a better overview
    today = date.today()
    start_date = today - timedelta(days=30)
    end_date = today + timedelta(days=180)
    
    # 1. Get explicit vaccine records
    vaccines = db.query(Vaccine).join(Animal).filter(
        Vaccine.next_due_date >= start_date,
        Vaccine.next_due_date <= end_date
    ).all()
    
    results = [
        {
            "id": f"v_{v.id}",
            "animal_name": v.animal.name,
            "vaccine_name": v.name,
            "due_date": v.next_due_date,
            "owner_info": v.animal.adopter_name or (v.animal.owner.email if v.animal.owner else "No Owner"),
            "source": "Schedule"
        } for v in vaccines
    ]
    
    # 2. Get animals with vaccination info in their profile
    animals_with_vax = db.query(Animal).filter(Animal.last_vaccination_date != None).all()
    
    for animal in animals_with_vax:
        last_vax = animal.last_vaccination_date
        
        # Scenario A: The date entered is in the future (treated as an appointment/due date)
        if last_vax >= today:
            next_due = last_vax
            source_label = "Profile Info (Upcoming)"
        else:
            # Scenario B: The date is in the past, estimate next due (+1 year)
            try:
                next_due = last_vax.replace(year=last_vax.year + 1)
            except ValueError: # handle leap year Feb 29
                next_due = last_vax + (date(last_vax.year + 1, 1, 1) - date(last_vax.year, 1, 1))
            source_label = "Profile Info (Est. 1yr)"
            
        if start_date <= next_due <= end_date:
            # Avoid duplication if there's already a formal vaccine record for this animal with similar name
            exists = any(v["animal_name"] == animal.name and v["vaccine_name"] == animal.last_vaccination_name for v in results)
            if not exists:
                results.append({
                    "id": f"a_{animal.id}",
                    "animal_name": animal.name,
                    "vaccine_name": animal.last_vaccination_name or "General",
                    "due_date": next_due,
                    "owner_info": animal.adopter_name or (animal.owner.email if animal.owner else "No Owner"),
                    "source": source_label
                })

    # Sort by due date
    results.sort(key=lambda x: x["due_date"])
    
    return results
