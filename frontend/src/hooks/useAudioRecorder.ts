import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

interface UseAudioRecorderReturn {
  loading: boolean;
  transcription: string;
  isRecording: boolean;
  isPaused: boolean;
  countdown: number | null;
  message: string;
  mediaBlobUrl: string | null;
  handleStartRecording: (startRecording: () => void) => void;
  handlePauseRecording: (pauseRecording: () => void) => void;
  handleResumeRecording: (resumeRecording: () => void) => void;
  uploadAudio: (audioBlob: Blob) => Promise<void>;
}

const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("");
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null);

  const uploadAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.wav");

    setLoading(true);

    try {
      const response = await apiClient.post("/upload", formData);
      setTranscription(response.data.transcription);
      setMessage("Audio successfully transcribed! 🎉");
    } catch (error: any) {
      console.error("Error uploading audio:", error);
      setMessage(
        `Failed to upload audio. ${
          error.response?.data?.detail || "Unknown error occurred."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartRecording = (startRecording: () => void) => {
    setIsRecording(true);
    setIsPaused(false);
    setCountdown(1);
    setMessage("");
    setMediaBlobUrl(null);
    startRecording();
  };

  const handlePauseRecording = (pauseRecording: () => void) => {
    setIsPaused(true);
    pauseRecording();
  };

  const handleResumeRecording = (resumeRecording: () => void) => {
    setIsPaused(false);
    resumeRecording();
  };


  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(
        () => setCountdown((prev) => (prev ? prev - 1 : null)),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return {
    loading,
    transcription,
    isRecording,
    isPaused,
    countdown,
    message,
    mediaBlobUrl,
    handleStartRecording,
    handlePauseRecording,
    handleResumeRecording,
    uploadAudio,
  };
};

export default useAudioRecorder;
