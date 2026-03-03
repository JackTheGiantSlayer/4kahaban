from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.api.dependencies import get_db, get_current_active_user, get_current_admin_user
from app.models.all_models import User
from app.schemas.all_schemas import UserResponse, UserUpdate, UserCreate
from app.core.security import get_password_hash

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_me(user_in: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if user_in.full_name is not None:
        current_user.full_name = user_in.full_name
    if user_in.phone is not None:
        current_user.phone = user_in.phone
    if user_in.address is not None:
        current_user.address = user_in.address
    if user_in.password is not None:
        current_user.hashed_password = get_password_hash(user_in.password)
        
    db.commit()
    db.refresh(current_user)
    return current_user

# Admin routes
@router.get("/", response_model=List[UserResponse])
def read_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.delete("/{user_id}", response_model=dict)
def delete_user(user_id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
        
    db.delete(user)
    db.commit()
    return {"msg": f"User {user_id} deleted successfully"}

@router.post("/", response_model=UserResponse)
def create_user_admin(user_in: UserCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    user_db = db.query(User).filter(User.email == user_in.email).first()
    if user_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        address=user_in.address
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/{user_id}", response_model=UserResponse)
def update_user_admin(user_id: int, user_in: UserUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin_user)):
    user_db = db.query(User).filter(User.id == user_id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_in.full_name is not None:
        user_db.full_name = user_in.full_name
    if user_in.phone is not None:
        user_db.phone = user_in.phone
    if user_in.address is not None:
        user_db.address = user_in.address
    if user_in.password is not None:
        user_db.hashed_password = get_password_hash(user_in.password)
        
    db.commit()
    db.refresh(user_db)
    return user_db
