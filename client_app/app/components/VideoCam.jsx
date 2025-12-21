import { useState, useRef, useEffect } from "react";

export default function VideoCapture({ onComplete, onUpload, onCancel }) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    startWebcam();
    return () => stopWebcam();
  }, []);

  // Start Webcam
  const startWebcam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      if (mediaRef.current) mediaRef.current.srcObject = s;
    } catch (err) {
      console.error("Cannot access webcam:", err);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Recording Start
  const startRecording = () => {
    if (!stream) return;
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = e => chunksRef.current.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      onComplete(blob); // send recorded video to parent
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  // Recording Stop
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
    stopWebcam();
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      stopWebcam();
      onUpload(file); // pass uploaded file to parent
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Webcam Preview */}
      <video ref={mediaRef} autoPlay muted className="w-96 h-56 bg-black rounded" />

      {/* Recording Buttons */}
      {!recording ? (
        <button
          onClick={startRecording}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Stop Recording
        </button>
      )}

      {/* Upload Option */}
      <div className="mt-4">
        <label className="cursor-pointer text-blue-600 underline">
          Upload a Video
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Cancel Button */}
      <button
        onClick={() => {
          stopWebcam();
          onCancel();
        }}
        className="mt-2 text-sm text-gray-500 underline"
      >
        Cancel
      </button>
    </div>
  );
}
