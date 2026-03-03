from passlib.context import CryptContext
from sqlalchemy import create_engine, text
import os

DATABASE_URL = "postgresql://postgres:postgres@db:5432/pet_db"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

hashed_password = pwd_context.hash("admin123")

engine = create_engine(DATABASE_URL)
with engine.connect() as connection:
    connection.execute(text("UPDATE users SET hashed_password = :hp WHERE email = :email"), {"hp": hashed_password, "email": "admin@4kahaban.com"})
    connection.commit()
    print(f"Updated password for admin@4kahaban.com to hash: {hashed_password}")
