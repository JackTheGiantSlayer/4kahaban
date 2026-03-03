import os
from PIL import Image
from io import BytesIO
from fastapi import UploadFile

UPLOAD_DIR = "uploads"
MAX_SIZE_KB = 150
MAX_SIZE_BYTES = MAX_SIZE_KB * 1024

def process_and_save_image(file: UploadFile, folder_name: str, filename: str) -> str:
    """
    Processes the uploaded image to be under MAX_SIZE_KB and saves it.
    Returns the relative path to the saved file.
    """
    # Create the folder if it doesn't exist
    target_dir = os.path.join(UPLOAD_DIR, folder_name)
    os.makedirs(target_dir, exist_ok=True)
    
    file_path = os.path.join(target_dir, filename)
    relative_path = f"/{UPLOAD_DIR}/{folder_name}/{filename}"

    # Read image
    content = file.file.read()
    file.file.seek(0)
    
    # If size is already smaller than max, just save it
    if len(content) <= MAX_SIZE_BYTES:
        with open(file_path, "wb") as f:
            f.write(content)
        return relative_path

    # Otherwise, resize and compress
    img = Image.open(BytesIO(content))
    
    # Convert RGBA to RGB for JPEG saving
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
        
    quality = 90
    while True:
        buffer = BytesIO()
        img.save(buffer, format="JPEG", quality=quality, optimize=True)
        size = buffer.tell()
        
        if size <= MAX_SIZE_BYTES or quality <= 10:
            with open(file_path, "wb") as f:
                f.write(buffer.getvalue())
            break
        
        # If still too large, reduce quality and dimensions
        quality -= 10
        width, height = img.size
        img = img.resize((int(width * 0.9), int(height * 0.9)), Image.Resampling.LANCZOS)
        
    return relative_path
