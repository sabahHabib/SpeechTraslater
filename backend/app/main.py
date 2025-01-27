from fastapi import FastAPI
from . import models
from .database import engine
from .routers import audio_to_text, text_to_speech

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

models.base.metadata.create_all(engine)
app.include_router(audio_to_text.router)
app.include_router(text_to_speech.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
