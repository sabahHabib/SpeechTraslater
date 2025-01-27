import speech_recognition as sr
from io import BytesIO
from fastapi import HTTPException
from pydub import AudioSegment


def convert_audio_to_wav(audio_data):
    try:
        audio_data.seek(0)
        audio = AudioSegment.from_file(audio_data)

        wav_data = BytesIO()
        audio.export(wav_data, format="wav", codec="pcm_s16le")
        wav_data.seek(0)
        return wav_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error converting audio: {str(e)}")


def audio_to_text(audio_data):
    recognizer = sr.Recognizer()
    try:
        wav_audio_data = convert_audio_to_wav(audio_data)

        with sr.AudioFile(wav_audio_data) as source:
            recognizer.adjust_for_ambient_noise(source)
            audio = recognizer.record(source)
        text = recognizer.recognize_google(audio)
        return text

    except sr.UnknownValueError:
        raise HTTPException(status_code=400, detail="Could not understand the audio.")
    except sr.RequestError:
        raise HTTPException(status_code=500, detail="Error with the Google Recognition service.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
