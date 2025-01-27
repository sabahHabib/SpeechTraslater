import React, { useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  ProgressBar,
} from "react-bootstrap";
import useAudioRecorder from "../hooks/useAudioRecorder";

const AudioRecorderApp: React.FC = () => {
  const {
    loading,
    transcription,
    isRecording,
    isPaused,
    countdown,
    message,
    handleStartRecording,
    handlePauseRecording,
    handleResumeRecording,
    uploadAudio,
  } = useAudioRecorder();

  const [isUploaded, setIsUploaded] = useState(false);
  const [showStopMessage, setShowStopMessage] = useState(false);

  const handleUpload = async (recordedBlobUrl: string) => {
    try {
      const response = await fetch(recordedBlobUrl);
      const blob = await response.blob();
      await uploadAudio(blob);
      setIsUploaded(true);
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  const handleStopRecording = (stopRecording: () => void) => {
    stopRecording();
    setShowStopMessage(true);
  };

  return (
    <div>
     <Container>
        <div className='mt-5'>
          <div className='mt-5'  >


            <ReactMediaRecorder
              audio
              render={({
                startRecording,
                stopRecording,
                pauseRecording,
                resumeRecording,
                mediaBlobUrl: recordedBlobUrl,
              }) => (
                <Card className="mb-4 mt-4 p-5">
                  <Card.Body>
                  <h2 className="text-center mb-2">Record and Transcribe Audio</h2>
                    <div className="d-flex justify-content-center gap-4 mt-5">
                      {!isRecording && !isUploaded && (
                        <Button
                          variant="primary"
                          onClick={() => {
                            handleStartRecording(startRecording);
                            setIsUploaded(false);
                            setShowStopMessage(false);
                          }}
                          disabled={loading}
                        >
                          <i className="bi bi-mic-fill"></i> Start Recording
                        </Button>
                      )}
                      {isRecording && !isPaused && !isUploaded && (
                        <>
                          <Button
                            variant="secondary"
                            onClick={() => handlePauseRecording(pauseRecording)}
                            disabled={loading}
                          >
                            <i className="bi bi-pause-fill"></i> Pause
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleStopRecording(stopRecording)}
                            disabled={loading}
                          >
                            <i className="bi bi-stop-fill"></i> Stop
                          </Button>
                        </>
                      )}
                      {isRecording && isPaused && !isUploaded && (
                        <>
                          <Button
                            variant="success"
                            onClick={() => handleResumeRecording(resumeRecording)}
                            disabled={loading}
                          >
                            <i className="bi bi-play-fill"></i> Resume
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleStopRecording(stopRecording)}
                            disabled={loading}
                          >
                            <i className="bi bi-stop-fill"></i> Stop
                          </Button>
                        </>
                      )}
                    </div>

                    {countdown !== null && countdown > 0 && (
                      <div className="text-center mt-3">
                        <p>Recording will start in {countdown} seconds...</p>
                      </div>
                    )}

                    {isRecording && countdown === 0 && !isUploaded && !showStopMessage && (
                      <Alert variant={isPaused ? "warning" : "info"} className="mt-3">
                        {isPaused
                          ? "Recording is paused. Resume when you're ready!"
                          : "Recording Started You Can Speak Now....! 🎙️"}
                      </Alert>
                    )}

                    {showStopMessage && (
                      <Alert variant="secondary" className="mt-3">
                        Recording stopped. You can listen to your audio or upload it.
                      </Alert>
                    )}

                    {recordedBlobUrl && (
                      <div className="text-center mt-4">
                        <audio
                          controls
                          src={recordedBlobUrl}
                          className="w-100 mb-3"
                        ></audio>
                        {!isUploaded && (
                          <Button
                            variant="primary"
                            onClick={() => {
                              handleUpload(recordedBlobUrl);
                              setIsUploaded(true);
                              setShowStopMessage(false);
                            }}
                            disabled={loading}
                          >
                            <i className="bi bi-cloud-upload-fill"></i> Upload Recording
                          </Button>
                        )}
                      </div>
                    )}

                    <div className="d-flex justify-content-center gap-3">
                      {isUploaded && (
                        <Button
                          variant="primary"
                          onClick={() => {
                            handleStartRecording(startRecording);
                            setIsUploaded(false);
                            setShowStopMessage(false);
                          }}
                          disabled={loading}
                        >
                          <i className="bi bi-mic-fill"></i> Start Recording Again
                        </Button>
                      )}
                    </div>
                  </Card.Body>

                  <Card.Footer>
                    {loading && (
                      <div>
                        <ProgressBar animated now={100} className="mb-2" />
                        <p className="text-center">Uploading audio...</p>
                      </div>
                    )}
                    {message && (
                      <p
                        className={`text-center mt-2 ${
                          message.includes("successfully") ? "text-success" : "text-danger"
                        }`}
                      >
                        {message}
                      </p>
                    )}
                  </Card.Footer>
                </Card>
              )}
            />
          </div>

          <div>
            {transcription && (
              <div className="mt-5 pr-5">
                <h4>Transcription</h4>
                <Form.Control as="textarea" rows={5} readOnly value={transcription} />
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AudioRecorderApp;
