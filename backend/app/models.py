from sqlalchemy import Column, Integer, String, LargeBinary
from .database import base


class VoiceRecording(base):
    __tablename__ = 'voice_recordings'
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True, nullable=True)
    voice_data = Column(LargeBinary, nullable=True)
    transcription = Column(String, index=True, nullable=True)


class AudioEntry(base):
    __tablename__ = 'texts'
    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=True)
    audio_data = Column(LargeBinary, nullable=True)
    audio_path = Column(String, nullable=True)
