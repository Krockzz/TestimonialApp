import { useState } from "react";
import {
  Play,
  Heart,
  ChevronUp,
  Trash2,
  ExternalLink,
  Download,
} from "lucide-react";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmit } from "@remix-run/react";

import ConfirmModal from "./ConfirmModal.jsx";
import IntegrationModal from "./IntegrationModal.jsx";
import { FaYoutube } from "react-icons/fa6";
import Featured from "./FeaturedHeart.jsx";

export default function YouTubeIntegration({ youtubeTestimonials = [] }) {
  youtubeTestimonials = Array.isArray(youtubeTestimonials)
    ? youtubeTestimonials
    : [];

  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const submit = useSubmit();

  const toggleExpand = (id) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const handleToDelete = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (!testimonialToDelete) return;

    const form = new FormData();
    form.append("testimonialId", testimonialToDelete._id);
    form.append("spaceId", testimonialToDelete.space);

    submit(form, {
      method: "post",
      action: `/space/${testimonialToDelete.space}`,
    });

    setTestimonialToDelete(null);
    setConfirmDelete(false);
  };

  return (
    <div className="w-full bg-gray-950 text-white px-6 py-6">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-2">YouTube Testimonials</h1>
      <p className="text-gray-400 mb-10 max-w-md">
        Import video testimonials directly from YouTube.
      </p>

      <AnimatePresence mode="wait">
        {youtubeTestimonials.length === 0 ? (
          /* EMPTY STATE */
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center gap-6 py-24"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              <Download className="w-14 h-14 text-gray-500" />
            </motion.div>

            <h2 className="text-xl font-semibold">Import from YouTube</h2>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              Paste a YouTube link to import a video testimonial.
            </p>

            <button
              onClick={() => setShowIntegrationModal(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 hover:bg-gray-800 transition px-5 py-2 text-sm"
            >
              <FaYoutube size={24} />
              Import Video
            </button>
          </motion.div>
        ) : (
          /* VIDEO CARDS */
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex justify-end mb-5">
              <button
                onClick={() => setShowIntegrationModal(true)}
                className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 hover:bg-gray-800 transition px-4 py-2 text-sm"
              >
                <FaYoutube size={18} />
                Import Video
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {youtubeTestimonials.map((t) => {
                const y = t.youtubeData || {};

                return (
                  <motion.div
                    key={t._id}
                    layout
                    whileHover={{ scale: 1.02 }}
                    className="min-h-[420px] bg-gradient-to-b from-gray-900 to-gray-950
                               rounded-2xl border border-gray-800
                               shadow-[0_20px_40px_rgba(0,0,0,0.45)]
                               overflow-hidden flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative group">
                      <img
                        src={y.thumbnail || "/default-thumbnail.png"}
                        alt={y.title || "YouTube Video"}
                        className="w-full h-72 sm:h-80 xl:h-96 object-cover"
                      />
                 
                 <div className="absolute top-3 left-3 z-30 pointer-events-auto">
  <div className="bg-black/60 backdrop-blur-sm p-2 rounded-full hover:scale-110 transition">
    <Featured testimonial={t} />
  </div>
</div>


                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full">
                          <Play size={42} />
                        </div>
                      </div>

                      {/* Duration */}
                      {y.durationSec && (
                        <div className="absolute bottom-2 right-2 text-xs bg-black/70 px-2 py-0.5 rounded">
                          {y.durationSec}s
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div className="text-base font-semibold line-clamp-2 leading-snug">
                        {y.title || "Untitled Video"}
                      </div>

                      <div className="text-xs text-gray-500">
                        {y.channelName || "Unknown Channel"}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-auto">
                        <Heart size={13} className="text-red-500/80" />
                        <span>{y.upvotes || 0}</span>

                        <span>
                          {t.createdAt
                            ? dayjs(t.createdAt).format("MMM D, YYYY")
                            : ""}
                        </span>

                        <button
                          onClick={() => toggleExpand(t._id)}
                          className="ml-auto hover:text-white transition"
                        >
                          <ChevronUp
                            size={16}
                            className={`transition-transform ${
                              expandedCardId === t._id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Expand Actions */}
                      <AnimatePresence>
                        {expandedCardId === t._id && (
                          <motion.div
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="pt-4 mt-3 border-t border-gray-800 flex justify-between text-xs"
                          >
                            {y.originalVideoUrl && (
                              <a
                                href={y.originalVideoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-indigo-400 flex items-center gap-1 transition"
                              >
                                <ExternalLink size={14} />
                                Open
                              </a>
                            )}

                            <button className="hover:text-green-400 transition">
                              Download
                            </button>

                            <button
                              onClick={() => handleToDelete(t)}
                              className="hover:text-red-500 flex items-center gap-1 transition"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <IntegrationModal
        isOpen={showIntegrationModal}
        onClose={() => setShowIntegrationModal(false)}
        platform="youtube"
      />

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this video testimonial?"
      />
    </div>
  );
}
