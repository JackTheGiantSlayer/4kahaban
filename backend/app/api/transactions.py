from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
import shutil
from datetime import date

from app.core.database import get_db
from app.models.all_models import Transaction
from app.schemas.all_schemas import TransactionResponse

router = APIRouter()

UPLOAD_DIR = "uploads/receipts"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/", response_model=List[TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):
    transactions = db.query(Transaction).order_by(Transaction.date_recorded.desc()).all()
    return transactions

@router.post("/", response_model=TransactionResponse)
def create_transaction(
    type: str = Form(...),
    amount: float = Form(...),
    description: str = Form(...),
    date_recorded: date = Form(...),
    receipt_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    image_url = None
    if receipt_image:
        extension = receipt_image.filename.split(".")[-1]
        unique_filename = f"receipt_{uuid.uuid4().hex}.{extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(receipt_image.file, buffer)
        image_url = f"/{UPLOAD_DIR}/{unique_filename}"

    new_tx = Transaction(
        type=type,
        amount=amount,
        description=description,
        date_recorded=date_recorded,
        receipt_image_url=image_url
    )
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx

@router.delete("/{tx_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(tx_id: int, db: Session = Depends(get_db)):
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if tx.receipt_image_url and os.path.exists(tx.receipt_image_url.lstrip('/')):
        try:
            os.remove(tx.receipt_image_url.lstrip('/'))
        except Exception as e:
            print(f"Error deleting receipt image: {e}")

    db.delete(tx)
    db.commit()
    return None
