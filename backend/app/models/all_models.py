from sqlalchemy import Boolean, Column, Integer, String, Date, ForeignKey, DateTime, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    phone = Column(String)
    address = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    animals_adopted = relationship("Animal", back_populates="owner")


class Animal(Base):
    __tablename__ = "animals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    gender = Column(String) # Male / Female
    breed = Column(String)
    color = Column(String)
    birth_date = Column(Date)
    microchip = Column(String, unique=True, index=True)
    image_url = Column(String) # Path to the resized image
    image_folder = Column(String) # Folder name
    description = Column(Text)
    status = Column(String, default="looking_for_home") # looking_for_home, adopted
    
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Null if no owner yet
    
    # New Fields
    last_vaccination_date = Column(Date, nullable=True)
    last_vaccination_name = Column(String, nullable=True)
    adopter_name = Column(String, nullable=True)
    adopter_address = Column(Text, nullable=True)
    adopter_phone = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="animals_adopted")
    vaccines = relationship("Vaccine", back_populates="animal", cascade="all, delete-orphan")
    images = relationship("AnimalImage", back_populates="animal", cascade="all, delete-orphan")


class AnimalImage(Base):
    __tablename__ = "animal_images"

    id = Column(Integer, primary_key=True, index=True)
    animal_id = Column(Integer, ForeignKey("animals.id"), nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    animal = relationship("Animal", back_populates="images")


class Vaccine(Base):
    __tablename__ = "vaccines"

    id = Column(Integer, primary_key=True, index=True)
    animal_id = Column(Integer, ForeignKey("animals.id"), nullable=False)
    name = Column(String, nullable=False)
    date_administered = Column(Date, nullable=False)
    next_due_date = Column(Date)
    notified_admin = Column(Boolean, default=False)
    
    animal = relationship("Animal", back_populates="vaccines")
    

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    contact_info = Column(String)
    description = Column(Text)
    doctors = relationship("Doctor", back_populates="hospital")

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    specialty = Column(String)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    
    hospital = relationship("Hospital", back_populates="doctors")


class News(Base):
    __tablename__ = "news"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    image_url = Column(String)
    event_period = Column(String, nullable=True)
    date_posted = Column(DateTime, default=datetime.utcnow)
class Album(Base):
    __tablename__ = "albums"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    photos = relationship("GalleryPhoto", back_populates="album", cascade="all, delete-orphan")

class GalleryPhoto(Base):
    __tablename__ = "gallery_photos"
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=False)
    caption = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    album_id = Column(Integer, ForeignKey("albums.id"), nullable=True)
    album = relationship("Album", back_populates="photos")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False) # "income" or "expense"
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=False)
    receipt_image_url = Column(String, nullable=True)
    date_recorded = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
