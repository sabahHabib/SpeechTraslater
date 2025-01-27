from pydantic import BaseModel


class VoiceRecorder(BaseModel):
    filename: str
    transcription: str

    class Config:
        from_attributes = True


class TextResponse(BaseModel):
    text: str

    class Config:
        from_attributes = True
