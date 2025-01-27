from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session

from .models.audio import AudioProcessing
from .. import schemas
from ..database import get_db

router = APIRouter(tags=['TEXT'])


@router.post("/convert", status_code=201, )
def convert_text(request: schemas.TextResponse = Form(...), db: Session = Depends(get_db)):
    audio_service = AudioProcessing(db)
    return audio_service.process_text_to_audio(request.text)
