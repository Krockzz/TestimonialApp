import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { Form } from "@remix-run/react";

export default function IntegrationModal({ isOpen, onClose, spaceId }) {
  const [tweetUrl, setTweetUrl] = useState("");
  const [addToWall, setAddToWall] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate minimum 10-second loader
    setTimeout(() => {
      setIsSubmitting(false);
      setTweetUrl(""); // clear the form
      setAddToWall(true);
      onClose(); // close modal automatically after 10 sec
    }, 10000);

    // Allow Remix form to continue submission
    e.target.submit();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={!isSubmitting ? onClose : undefined} // block click while loading
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            <div className="bg-white w-[520px] rounded-2xl shadow-2xl p-6 relative border border-gray-200">
              {/* Close button */}
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                <X size={22} />
              </button>

              {/* Header */}
              <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">
                Import Tweet
              </h2>

              {/* Info Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5 shadow-sm">
                <p className="text-sm text-gray-600 leading-relaxed text-center">
                  <span className="text-red-500 font-semibold">*</span> Paste the
                  tweet URL in this format:
                  <br />
                  <span className="text-gray-800 font-mono text-sm break-all">
                    https://twitter.com/user/status/tweet-id
                  </span>
                </p>
              </div>

              {/* Remix Form */}
              <Form method="post" className="space-y-4" onSubmit={handleSubmit}>
                <input type="hidden" name="intent" value="importTweet" />
                <input type="hidden" name="spaceId" value={spaceId} />

                {/* Tweet URL */}
                <input
                  type="text"
                  name="tweetUrl"
                  value={tweetUrl}
                  onChange={(e) => setTweetUrl(e.target.value)}
                  placeholder="Paste Tweet URL here"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-sm placeholder-gray-400 transition"
                  required
                  disabled={isSubmitting}
                />

                {/* Checkbox */}
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="addToWall"
                    checked={addToWall}
                    onChange={() => setAddToWall(!addToWall)}
                    className="w-4 h-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500 transition"
                    disabled={isSubmitting}
                  />
                  <span className="text-gray-700 text-sm font-medium">
                    Add to my Wall of Love
                  </span>
                </label>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg py-2.5 transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    "Add Tweet"
                  )}
                </motion.button>
              </Form>

              {/* Overlay Loader */}
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl"
                >
                  <svg
                    className="animate-spin h-10 w-10 text-indigo-600 mb-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <p className="text-gray-700 font-medium">Importing tweet...</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
