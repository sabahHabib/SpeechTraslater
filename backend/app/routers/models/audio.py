from fastapi import HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from io import BytesIO
from ..services.text_to_speech import text_to_audio
from ...models import AudioEntry


class AudioProcessing:
    def __init__(self, db: Session):
        self.db = db

    def process_text_to_audio(self, text: str):
        if not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty.")
        audio_data = text_to_audio(text)
        if not audio_data:
            raise HTTPException(status_code=500, detail="Failed to generate audio.")

        audio_entry = self.save_audio_entry(text, audio_data)
        audio_stream = self.get_audio(audio_entry)
        return StreamingResponse(audio_stream, media_type='audio/mpeg')

    def save_audio_entry(self, text: str, audio_data: bytes):
        audio_entry = AudioEntry(text=text, audio_data=audio_data)
        self.db.add(audio_entry)
        self.db.commit()
        self.db.refresh(audio_entry)
        return audio_entry

    def get_audio(self, audio_entry):
        audio_stream = BytesIO(audio_entry.audio_data)
        audio_stream.seek(0)
        return audio_stream
