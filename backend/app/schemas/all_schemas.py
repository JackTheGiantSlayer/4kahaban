from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

# Vaccine Schemas
class VaccineBase(BaseModel):
    name: str
    date_administered: date
    next_due_date: Optional[date] = None

class VaccineCreate(VaccineBase):
    animal_id: int

class VaccineResponse(VaccineBase):
    id: int
    animal_id: int
    notified_admin: bool

    class Config:
        orm_mode = True
        from_attributes = True

# Animal Schemas
class AnimalBase(BaseModel):
    name: str
    gender: Optional[str] = None
    breed: Optional[str] = None
    color: Optional[str] = None
    birth_date: Optional[date] = None
    microchip: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = "looking_for_home"
    last_vaccination_date: Optional[date] = None
    last_vaccination_name: Optional[str] = None
    adopter_name: Optional[str] = None
    adopter_address: Optional[str] = None
    adopter_phone: Optional[str] = None

class AnimalCreate(AnimalBase):
    pass # Image will be handled as UploadFile

class AnimalUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    breed: Optional[str] = None
    color: Optional[str] = None
    birth_date: Optional[date] = None
    microchip: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    owner_id: Optional[int] = None
    last_vaccination_date: Optional[date] = None
    last_vaccination_name: Optional[str] = None
    adopter_name: Optional[str] = None
    adopter_address: Optional[str] = None
    adopter_phone: Optional[str] = None

class AnimalImageResponse(BaseModel):
    id: int
    image_url: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class AnimalResponse(AnimalBase):
    id: int
    image_url: Optional[str] = None
    image_folder: Optional[str] = None
    owner_id: Optional[int] = None
    created_at: datetime
    vaccines: List[VaccineResponse] = []
    images: List[AnimalImageResponse] = []
    owner: Optional[UserResponse] = None

    class Config:
        orm_mode = True
        from_attributes = True

# Hospital & Doctor Schemas
class DoctorBase(BaseModel):
    name: str
    specialty: str

class DoctorResponse(DoctorBase):
    id: int
    hospital_id: int

    class Config:
        orm_mode = True
        from_attributes = True

class HospitalBase(BaseModel):
    name: str
    address: Optional[str] = None
    contact_info: Optional[str] = None
    description: Optional[str] = None

class HospitalCreate(HospitalBase):
    pass

class HospitalUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    contact_info: Optional[str] = None
    description: Optional[str] = None

class DoctorCreate(DoctorBase):
    hospital_id: int

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    specialty: Optional[str] = None

class HospitalResponse(HospitalBase):
    id: int
    doctors: List[DoctorResponse] = []

    class Config:
        orm_mode = True
        from_attributes = True

# News Schemas
class NewsBase(BaseModel):
    title: str
    content: str
    image_url: Optional[str] = None
    event_period: Optional[str] = None

class NewsResponse(NewsBase):
    id: int
    date_posted: datetime

    class Config:
        orm_mode = True
        from_attributes = True
# Gallery Schemas
class GalleryPhotoBase(BaseModel):
    caption: Optional[str] = None
    album_id: Optional[int] = None

class GalleryPhotoResponse(GalleryPhotoBase):
    id: int
    image_url: str
    created_at: datetime

    class Config:
        orm_mode = True
        from_attributes = True

class AlbumBase(BaseModel):
    title: str
    description: Optional[str] = None

class AlbumCreate(AlbumBase):
    pass

class AlbumResponse(AlbumBase):
    id: int
    created_at: datetime
    photos: List[GalleryPhotoResponse] = []

    class Config:
        orm_mode = True
        from_attributes = True
