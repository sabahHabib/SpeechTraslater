from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session
from io import BytesIO
from ..services.speech_to_text import audio_to_text
from ...models import VoiceRecording
from ... import schemas


class TextProcessing:
    def __init__(self, db: Session):
        self.db = db

    async def process_audio_upload(self, file: UploadFile):
        contents = await file.read()
        filename = file.filename
        if not file.content_type.startswith("audio/"):
            raise HTTPException(status_code=400, detail="File must be an audio file.")
        audio_data = BytesIO(contents)
        transcription = audio_to_text(audio_data)
        db_voice = self.save_audio_recording(filename, contents, transcription)

        return schemas.VoiceRecorder.from_orm(db_voice)

    def save_audio_recording(self, filename: str, voice_data: bytes, transcription: str):
        voice_entry = VoiceRecording(
            filename=filename,
            voice_data=voice_data,
            transcription=transcription
        )
        self.db.add(voice_entry)
        self.db.commit()
        self.db.refresh(voice_entry)
        return voice_entry
