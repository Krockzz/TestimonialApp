import { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@remix-run/react";
import Lottie from "lottie-react";
import Uploading from "../../../utilities/Uploading.json";

export default function TestimonialForm({
  space,
  rating,
  setRating,
  onClose,
  testimonialType,
}) {
  const [hover, setHover] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [formStarted, setFormStarted] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const spaceId = space._id;

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
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-600 shadow"
                />
              </div>

              <div className="mb-6 space-y-2 text-gray-700 text-sm">
                <p><strong>Who are you</strong> / what are you working on?</p>
                <p>How has <strong>[our product/service]</strong> helped you?</p>
                <p>What is the best thing about <strong>[our product/service]</strong>?</p>
              </div>

              <Form
                method="post"
                encType="multipart/form-data"
                className="space-y-6"
                onSubmit={() => {
                  setFormStarted(true);
                  setUploading(true);

                  setTimeout(() => {
                    setUploading(false);
                    setSubmitted(true);
                  }, 10000);
                }}
              >
                <input type="hidden" name="spaceId" value={spaceId} />
                <input type="hidden" name="type" value={testimonialType} />
                <input type="hidden" name="rating" value={rating || ""} />

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Your Rating</label>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map(( _, index) => {
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
                            className="cursor-pointer transition"
                            color={starValue <= (hover || rating) ? "#facc15" : "#e5e7eb"}
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(null)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Text or Video */}
                {testimonialType === "text" ? (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Your Testimonial <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="text"
                      required
                      className="w-full p-3 border rounded-md resize-none bg-white placeholder-gray-400"
                      rows={4}
                      placeholder="Write your testimonial here..."
                    ></textarea>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Video <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="video-upload"
                      type="file"
                      name="videoURL"
                      accept="video/*"
                      required={!videoPreview}
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setVideoPreview(URL.createObjectURL(file));
                          document.getElementById("video-file-name").textContent = file.name;
                        }
                      }}
                    />
                    {!videoPreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V8.25C3 7.01 4.007 6 5.25 6h13.5C19.993 6 21 7.007 21 8.25v8.25m-9 3l-3-3m0 0l3-3m-3 3h6" />
                          </svg>
                          <p className="text-sm text-gray-600"><span className="font-medium">Click to upload</span> or drag and drop</p>
                          <p id="video-file-name" className="text-xs text-gray-500">No file selected</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Uploaded Video</label>
                        <video
                          controls
                          src={videoPreview}
                          className="w-full h-auto max-h-[400px] rounded-md shadow-md object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setVideoPreview(null);
                            document.getElementById("video-upload").value = "";
                          }}
                          className="text-sm text-red-600 hover:underline"
                        >
                          ❌ Remove Video
                        </button>
                      </div>
                    )}
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

                {/* Avatar Upload */}
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
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:underline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center min-w-[100px]"
                  >
                    Send
                  </button>
                </div>
              </Form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
