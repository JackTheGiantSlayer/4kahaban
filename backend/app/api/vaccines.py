from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api.dependencies import get_db, get_current_active_user, get_current_admin_user
from app.models.all_models import Vaccine, Animal, User
from app.schemas.all_schemas import VaccineCreate, VaccineResponse

router = APIRouter()

@router.post("/", response_model=VaccineResponse)
def create_vaccine(vaccine_in: VaccineCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    animal = db.query(Animal).filter(Animal.id == vaccine_in.animal_id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
        
    # Only admin or the owner can add vaccines
    if not current_user.is_admin and animal.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    new_vac = Vaccine(
        animal_id=vaccine_in.animal_id,
        name=vaccine_in.name,
        date_administered=vaccine_in.date_administered,
        next_due_date=vaccine_in.next_due_date
    )
    db.add(new_vac)
    db.commit()
    db.refresh(new_vac)
    return new_vac

@router.get("/animal/{animal_id}", response_model=List[VaccineResponse])
def get_animal_vaccines(animal_id: int, db: Session = Depends(get_db)):
    vaccines = db.query(Vaccine).filter(Vaccine.animal_id == animal_id).all()
    return vaccines

@router.delete("/{vaccine_id}", response_model=dict)
def delete_vaccine(vaccine_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    vac = db.query(Vaccine).filter(Vaccine.id == vaccine_id).first()
    if not vac:
        raise HTTPException(status_code=404, detail="Vaccine not found")
    db.delete(vac)
    db.commit()
    return {"msg": "Vaccine deleted successfully"}
