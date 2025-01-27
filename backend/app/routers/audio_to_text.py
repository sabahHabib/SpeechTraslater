from fastapi import File, UploadFile, APIRouter, status, Depends
from sqlalchemy.orm import Session

from .models.text import TextProcessing
from .. import schemas
from ..database import get_db

router = APIRouter(tags=['AUDIO'])


@router.post("/upload", response_model=schemas.VoiceRecorder, status_code=status.HTTP_201_CREATED)
async def upload(file: UploadFile = File(...), db: Session = Depends(get_db)):
    text_service = TextProcessing(db)
    return await text_service.process_audio_upload(file)
