from gtts import gTTS
from io import BytesIO


def text_to_audio(text):
    tts = gTTS(text)
    audio_buffer = BytesIO()
    tts.write_to_fp(audio_buffer)
    audio_buffer.seek(0)
    audio_data = audio_buffer.read()
    return audio_data



