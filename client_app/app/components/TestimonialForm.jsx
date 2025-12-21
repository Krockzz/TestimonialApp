import { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import Uploading from "../../../utilities/Uploading.json";

export default function TestimonialForm({ space, rating, setRating, onClose, testimonialType }) {
  const [hover, setHover] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState(null);
  const [uploadedVideoFile, setUploadedVideoFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);


  const timerRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const videoStreamRef = useRef(null);
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const spaceId = space._id;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Start recording
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoStreamRef.current = stream;

    const options = { mimeType: "video/webm; codecs=vp8,opus" };
    const mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorderRef.current = mediaRecorder;
    recordedChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) recordedChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      setRecordedVideoBlob(blob);
      setVideoPreview(URL.createObjectURL(blob));
      setUploadedVideoFile(null);

      // stop stream + timer
      stream.getTracks().forEach((track) => track.stop());
      clearInterval(timerRef.current);
      setRecordingTime(0);

      setRecording(false);
    };

    mediaRecorder.start();
    setRecording(true);

    // Start timer
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  } catch (err) {
    console.error("Camera access error:", err);
    alert("Cannot access camera. Please allow permission.");
  }
};





 const stopRecording = () => {
  if (mediaRecorderRef.current && recording) {
    mediaRecorderRef.current.stop();
    clearInterval(timerRef.current);
  }
};


  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("video/")) {
      setUploadedVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setRecordedVideoBlob(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setUploading(true);

  const startTime = Date.now();
  const formData = new FormData(e.target);

  if (recordedVideoBlob) {
    const videoFile = new File([recordedVideoBlob], `testimonial-${Date.now()}.webm`, { type: "video/webm" });
    formData.append("videoURL", videoFile);
  } else if (uploadedVideoFile) {
    formData.append("videoURL", uploadedVideoFile);
  }

  if (avatarInputRef.current?.files[0]) {
    formData.append("avatar", avatarInputRef.current.files[0]);
  }

  try {
    const response = await fetch(`/${spaceId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, 5000 - elapsed); // ensure at least 5s
    await new Promise((resolve) => setTimeout(resolve, remaining));

    if (response.ok) {
      setSubmitted(true);
    } else {
      const error = await response.json().catch(() => ({}));
      alert(error.message || "Failed to submit testimonial");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Check console for details.");
  } finally {
    setUploading(false);
  }
};


  
useEffect(() => {
  if (recording && videoStreamRef.current && videoPreviewRef.current) {
    videoPreviewRef.current.srcObject = videoStreamRef.current;
    videoPreviewRef.current.muted = true;
    videoPreviewRef.current.playsInline = true;
    videoPreviewRef.current
      .play()
      .catch((err) => console.error("Video play error:", err));
  }
}, [recording]);


  return (
    <AnimatePresence>
       <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center overflow-auto p-4"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh] text-left"
        >
          {uploading ? (
            <div className="text-center py-9">
              <div className="flex flex-col items-center justify-center gap-2 pt-2">
                <Lottie animationData={Uploading} loop className="!m-0 !p-0" style={{ width: 120, height: 120 }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {testimonialType === "text" ? "Sending your testimonial..." : "Uploading your video..."}
              </h3>
              <p className="text-gray-600">Please wait, this may take a few seconds.</p>
            </div>
          ) : submitted ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Thank you for your testimonial!
              </h3>
              <p className="text-gray-600">We appreciate your feedback. 🙌</p>
              <button
                onClick={onClose}
                className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          )  : submitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="text-5xl">🎉</div>
              <h3 className="text-xl font-semibold text-gray-800">Thank you for your testimonial!</h3>
              <p className="text-gray-600">We appreciate your feedback. 🙌</p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                {testimonialType === "text"
                  ? "Write Text Testimonial To"
                  : "Upload Video Testimonial For"}
              </h2>
              <div className="flex justify-start mb-4">
                <img
                  src={space.avatar}
                  alt={space.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-600 shadow-lg"
                />
              </div>

              <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                <input type="hidden" name="spaceId" value={spaceId} />
                <input type="hidden" name="type" value={testimonialType} />
                <input type="hidden" name="rating" value={rating || ""} />

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Rating</label>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <label key={index}>
                          <input
                            type="radio"
                            className="hidden"
                            onChange={() => setRating(starValue)}
                            checked={rating === starValue}
                          />
                          <FaStar
                            size={24}
                            className="cursor-pointer transition-transform duration-200 hover:scale-110"
                            color={starValue <= (hover || rating) ? "#facc15" : "#e5e7eb"}
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(null)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Textarea or Video */}
                {testimonialType === "text" ? (
                  <textarea
                    name="text"
                    required
                    className="w-full p-4 border rounded-xl bg-gray-50 placeholder-gray-400 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={4}
                    placeholder="Write your testimonial here..."
                  />
                ) : (
                  <div>
                    {!videoPreview && !recording && (
                      <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className="flex gap-4"
                      >
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 shadow-md transition"
                        >
                          <p>Click to upload or drag & drop</p>
                          <p className="text-xs text-gray-500">{uploadedVideoFile?.name || "No file selected"}</p>
                        </div>
                        <div
                          onClick={startRecording}
                          className="flex-1 border-2 border-dashed border-green-500 rounded-xl p-6 text-center cursor-pointer hover:bg-green-50 hover:border-green-600 shadow-md transition"
                        >
                          <p>🎥 Record from Camera</p>
                        </div>
                      </div>
                    )}

             {recording && (
  <div className="space-y-2 mt-3 w-full flex flex-col items-center">
    {/* Recording indicator */}
    <div className="flex items-center gap-2 mb-2">
      <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
      <span className="font-mono text-sm text-red-600">
        {String(Math.floor(recordingTime / 60)).padStart(2, "0")}:
        {String(recordingTime % 60).padStart(2, "0")}
      </span>
    </div>

    <video
      ref={videoPreviewRef}
      autoPlay
      playsInline
      muted
      className="w-full max-w-xl h-[400px] rounded-md shadow-md object-cover border-2 border-gray-300 bg-black"
    />

    <button
      type="button"
      onClick={stopRecording}
      className="px-4 py-2 mt-2 bg-red-600 text-white rounded-md hover:bg-red-700"
    >
      ⏹ Stop Recording
    </button>
  </div>
)}




                    {videoPreview && !recording && (
                      <div className="space-y-2 mt-4">
                        <video
                          controls
                          src={videoPreview}
                          className="w-full h-auto max-h-[400px] rounded-xl shadow-lg object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setVideoPreview(null);
                            setRecordedVideoBlob(null);
                            setUploadedVideoFile(null);
                          }}
                          className="text-sm text-red-600 hover:underline"
                        >
                          ❌ Remove Video
                        </button>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="video/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setUploadedVideoFile(file);
                          setVideoPreview(URL.createObjectURL(file));
                          setRecordedVideoBlob(null);
                        }
                      }}
                    />
                  </div>
                )}

                
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-3 border rounded-md bg-white placeholder-gray-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full p-3 border rounded-md bg-white placeholder-gray-400"
                  />
                </div>

                {/* Avatar */}
                  <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Avatar <span className="text-gray-400 text-sm">(optional)</span>
                  </label>
                  {!avatarPreview ? (
                    <div
                      onClick={() => avatarInputRef.current?.click()}
                      className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V8.25C3 7.01 4.007 6 5.25 6h13.5C19.993 6 21 7.007 21 8.25v8.25m-9 3l-3-3m0 0l3-3m-3 3h6" />
                        </svg>
                        <p className="text-sm text-gray-600"><span className="font-medium">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">JPG, PNG under 2MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Preview</label>
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-24 h-24 rounded-full object-cover border shadow"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarPreview(null);
                          document.getElementById("avatar-upload").value = "";
                        }}
                        className="text-sm text-red-600 hover:underline"
                      >
                        ❌ Remove Avatar
                      </button>
                    </div>
                  )}

                  <input
                    type="file"
                    name="avatar"
                    id="avatar-upload"
                    accept="image/*"
                    ref={avatarInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                    className="hidden"
                  />
                </div>


                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2 text-gray-600 hover:text-gray-800 hover:underline transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition flex items-center justify-center min-w-[100px]"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
