from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from app.api.dependencies import get_db, get_current_active_user, get_current_admin_user
from app.models.all_models import Animal, User, AnimalImage
from app.schemas.all_schemas import AnimalResponse, AnimalUpdate
from app.services.image_service import process_and_save_image
import uuid

router = APIRouter()

@router.get("/", response_model=List[AnimalResponse])
def get_animals(skip: int = 0, limit: int = 100, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Animal)
    if status:
        query = query.filter(Animal.status == status)
    return query.offset(skip).limit(limit).all()

@router.get("/gallery", response_model=List[AnimalResponse])
def get_adopted_gallery(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # adopted animals for gallery
    return db.query(Animal).filter(Animal.status == "adopted").offset(skip).limit(limit).all()

@router.get("/{animal_id}", response_model=AnimalResponse)
def get_animal(animal_id: int, db: Session = Depends(get_db)):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    return animal

@router.post("/", response_model=AnimalResponse)
def create_animal(
    name: str = Form(...),
    gender: Optional[str] = Form(None),
    breed: Optional[str] = Form(None),
    color: Optional[str] = Form(None),
    birth_date: Optional[str] = Form(None), # expect YYYY-MM-DD
    microchip: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    status: Optional[str] = Form("looking_for_home"),
    owner_id: Optional[int] = Form(None),
    last_vaccination_date: Optional[str] = Form(None),
    last_vaccination_name: Optional[str] = Form(None),
    adopter_name: Optional[str] = Form(None),
    adopter_address: Optional[str] = Form(None),
    adopter_phone: Optional[str] = Form(None),
    images: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    # Check microchip
    if microchip:
        existing = db.query(Animal).filter(Animal.microchip == microchip).first()
        if existing:
            raise HTTPException(status_code=400, detail="Microchip already registered")

    folder_name = f"{name}_{uuid.uuid4().hex[:6]}"
    image_url = None
    animal_images = []
    
    if images:
        for idx, img in enumerate(images):
            if not img.content_type.startswith("image/"):
                continue
            filename = f"{uuid.uuid4().hex}.jpg"
            saved_url = process_and_save_image(img, folder_name, filename)
            if idx == 0:
                image_url = saved_url
            animal_images.append(AnimalImage(image_url=saved_url))

    new_animal = Animal(
        name=name, gender=gender, breed=breed, color=color, 
        birth_date=birth_date, microchip=microchip, description=description,
        status=status, owner_id=owner_id,
        last_vaccination_date=last_vaccination_date, last_vaccination_name=last_vaccination_name,
        adopter_name=adopter_name, adopter_address=adopter_address, adopter_phone=adopter_phone,
        image_url=image_url, image_folder=folder_name,
        images=animal_images
    )
    db.add(new_animal)
    db.commit()
    db.refresh(new_animal)
    return new_animal

@router.put("/{animal_id}", response_model=AnimalResponse)
def update_animal(
    animal_id: int,
    name: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    breed: Optional[str] = Form(None),
    color: Optional[str] = Form(None),
    birth_date: Optional[str] = Form(None),
    microchip: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    owner_id: Optional[int] = Form(None),
    last_vaccination_date: Optional[str] = Form(None),
    last_vaccination_name: Optional[str] = Form(None),
    adopter_name: Optional[str] = Form(None),
    adopter_address: Optional[str] = Form(None),
    adopter_phone: Optional[str] = Form(None),
    images: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
        
    if name: animal.name = name
    if gender: animal.gender = gender
    if breed: animal.breed = breed
    if color: animal.color = color
    if birth_date: animal.birth_date = birth_date
    if microchip: animal.microchip = microchip
    if description: animal.description = description
    if status: animal.status = status
    if owner_id is not None: animal.owner_id = owner_id
    if last_vaccination_date: animal.last_vaccination_date = last_vaccination_date
    if last_vaccination_name: animal.last_vaccination_name = last_vaccination_name
    if adopter_name: animal.adopter_name = adopter_name
    if adopter_address: animal.adopter_address = adopter_address
    if adopter_phone: animal.adopter_phone = adopter_phone
    
    if images:
        folder_name = animal.image_folder or f"{animal.name}_{uuid.uuid4().hex[:6]}"
        animal.image_folder = folder_name
        for idx, img in enumerate(images):
            if not img.content_type.startswith("image/"):
                continue
            filename = f"{uuid.uuid4().hex}.jpg"
            saved_url = process_and_save_image(img, folder_name, filename)
            
            # Add to relationship
            new_img = AnimalImage(image_url=saved_url, animal_id=animal.id)
            db.add(new_img)
            
            # If it's the first time or we want to update primary
            if idx == 0 or not animal.image_url:
                animal.image_url = saved_url
        
    db.commit()
    db.refresh(animal)
    return animal

@router.post("/{animal_id}/upload_image", response_model=AnimalResponse)
def upload_animal_image(animal_id: int, image: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
        
    if not current_user.is_admin and animal.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File is not an image")
        
    folder_name = animal.image_folder or f"{animal.name}_{uuid.uuid4().hex[:6]}"
    filename = f"{uuid.uuid4().hex}.jpg"
    image_url = process_and_save_image(image, folder_name, filename)
    
    animal.image_url = image_url
    animal.image_folder = folder_name
    db.commit()
    db.refresh(animal)
    return animal

@router.put("/{animal_id}/adopt", response_model=AnimalResponse)
def adopt_animal(animal_id: int, owner_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    owner = db.query(User).filter(User.id == owner_id).first()
    
    if not animal or not owner:
        raise HTTPException(status_code=404, detail="Animal or Owner not found")
        
    animal.owner_id = owner.id
    animal.status = "adopted"
    db.commit()
    db.refresh(animal)
    return animal
@router.delete("/{animal_id}", response_model=dict)
def delete_animal(animal_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    
    db.delete(animal)
    db.commit()
    return {"msg": "Animal deleted"}

@router.delete("/images/{image_id}", response_model=dict)
def delete_animal_image(image_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    img = db.query(AnimalImage).filter(AnimalImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    
    animal = db.query(Animal).filter(Animal.id == img.animal_id).first()
    
    # If this was the primary image, pick another one if available
    db.delete(img)
    db.commit()
    
    if animal and animal.image_url == img.image_url:
        next_img = db.query(AnimalImage).filter(AnimalImage.animal_id == animal.id).first()
        animal.image_url = next_img.image_url if next_img else None
        db.commit()
        
    return {"msg": "Image deleted"}

@router.post("/{animal_id}/set_primary_image/{image_id}", response_model=AnimalResponse)
def set_animal_primary_image(animal_id: int, image_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    animal = db.query(Animal).filter(Animal.id == animal_id).first()
    img = db.query(AnimalImage).filter(AnimalImage.id == image_id).first()
    
    if not animal or not img:
        raise HTTPException(status_code=404, detail="Animal or Image not found")
    
    if img.animal_id != animal.id:
        raise HTTPException(status_code=400, detail="Image does not belong to this animal")
    
    animal.image_url = img.image_url
    db.commit()
    db.refresh(animal)
    return animal
