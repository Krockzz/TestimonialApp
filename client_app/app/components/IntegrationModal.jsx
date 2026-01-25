import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { Form } from "@remix-run/react";

export default function IntegrationModal({ isOpen, onClose, spaceId, platform }) {
  const [url, setUrl] = useState("");
  const [addToWall, setAddToWall] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platformName =
    platform === "twitter"
      ? "Tweet"
      : platform === "reddit"
      ? "Reddit"
      : platform;

  const urlPlaceholder =
    platform === "twitter"
      ? "https://twitter.com/user/status/123..."
      : platform === "reddit"
      ? "https://www.reddit.com/r/sub/comments/post-id/..."
      : "Paste URL here";

  const badgeColor =
    platform === "twitter"
      ? "bg-sky-100 text-sky-700"
      : platform === "reddit"
      ? "bg-orange-100 text-orange-700"
      : "bg-gray-100 text-gray-700";

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setUrl("");
      setAddToWall(true);
      onClose();
    }, 10000);

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
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
          >
            <div className="bg-white w-full max-w-lg md:max-w-xl rounded-3xl shadow-2xl p-7 relative border border-gray-200">
              {/* Close */}
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition"
              >
                <X size={22} />
              </button>

              {/* Header */}
              <div className="flex flex-col items-center gap-2 mb-6">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeColor}`}
                >
                  {platform?.toUpperCase()}
                </span>

                <h2 className="text-2xl font-bold text-gray-900">
                  Import {platformName}
                </h2>

                <p className="text-sm text-gray-500 text-center max-w-sm">
                  Paste a public {platformName.toLowerCase()} link and instantly
                  convert it into a testimonial.
                </p>
              </div>

              {/* Info Box */}
              <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 mb-5">
                <p className="text-xs text-gray-500 mb-1">Expected format</p>
                <p className="font-mono text-sm text-gray-800 break-all">
                  {urlPlaceholder}
                </p>
              </div>

              {/* Form */}
              <Form method="post" className="space-y-5" onSubmit={handleSubmit}>
                <input type="hidden" name="intent" value={`import${platformName}`} />
                <input type="hidden" name="spaceId" value={spaceId} />

                {/* URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {platformName} URL
                  </label>
                  <input
                    type="text"
                    name={`${platform}Url`}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={urlPlaceholder}
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm
                      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                      transition placeholder:text-gray-400"
                    required
                  />
                </div>

                {/* Checkbox */}
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={addToWall}
                    onChange={() => setAddToWall(!addToWall)}
                    disabled={isSubmitting}
                    className="rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
                  />
                  Add to my Wall of Love
                </label>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white
                    font-semibold py-3 shadow-lg transition flex items-center justify-center"
                >
                  {isSubmitting ? "Importing..." : `Import ${platformName}`}
                </motion.button>
              </Form>

              {/* Loader Overlay */}
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-3xl
                    flex flex-col items-center justify-center gap-3"
                >
                  <div className="h-10 w-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                  <p className="text-sm font-medium text-gray-700 animate-pulse">
                    Fetching {platformName}...
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
