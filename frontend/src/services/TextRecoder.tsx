import React, { useState } from "react";
import apiClient from "../api/apiClient";
import { Spinner, Alert, Button, Card } from "react-bootstrap";

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const formData = new FormData();
      formData.append("text", text);

      const response = await apiClient.post('/convert', formData, {
        responseType: "blob",
      });

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating the audio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm p-4 mt-5">
      <Card.Body>
        <h2 className="text-center mb-4">Text to Speech</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert..."
            rows={6}
            className="form-control mb-3"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !text.trim()}
            className="w-100"
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Converting...
              </>
            ) : (
              "Convert to Audio"
            )}
          </Button>
        </form>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        {audioUrl && (
          <div className="mt-4 text-center">
            <h5>Generated Audio</h5>
            <audio controls className="w-100">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default TextToSpeech;
