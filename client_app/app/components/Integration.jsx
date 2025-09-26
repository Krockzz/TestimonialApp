import { useState } from "react";
import { Download, Heart, Star, ChevronUp } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { Linkedin, Instagram } from "lucide-react";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import ImportFromTwitterModal from "../components/IntegrationModal.jsx";
import ConfirmModal from "./ConfirmModal.jsx";
import { useSubmit } from "@remix-run/react";

export default function Integration({ twitterTestimonials }) {
  const [activePlatform, setActivePlatform] = useState("twitter");
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);

  // Track expanded card
  const [expandedCardId, setExpandedCardId] = useState(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleExpand = (id) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  const platforms = [
    { label: "Twitter", icon: <FaXTwitter size={20} />, key: "twitter" },
    { label: "LinkedIn", icon: <Linkedin size={20} />, key: "linkedin" },
    { label: "Instagram", icon: <Instagram size={20} />, key: "instagram" },
  ];

  const renderPlatformButtons = (size = "md") => (
    <div
      className={`flex flex-wrap gap-2 ${
        size === "center" ? "justify-center mt-4" : "justify-start mb-4"
      }`}
    >
      {platforms.map((p) => (
        <button
          key={p.key}
          onClick={() => {
            setActivePlatform(p.key);
            if (p.key === "twitter") setShowIntegrationModal(true);
          }}
          className={`flex items-center space-x-2 bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md transition text-sm ${
            size === "center" ? "px-4 py-2" : ""
          }`}
        >
          {p.icon}
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  );

  const submit = useSubmit();

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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col px-6 py-6">
      {/* Header */}
      <div className="text-3xl font-bold mb-3">Social media testimonials</div>
      <p className="text-muted-foreground mb-10 max-w-md">
        Import and track testimonials across social media.
      </p>

      <AnimatePresence mode="wait">
        {activePlatform === "twitter" ? (
          twitterTestimonials.length === 0 ? (
            // Empty state
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center gap-6 py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Download className="w-12 h-12 text-gray-400" />
              </motion.div>

              <h2 className="text-xl font-semibold">Import from</h2>
              <p className="text-sm text-gray-400 text-center max-w-xs">
                Select a platform to import your social media posts
              </p>

              {renderPlatformButtons("center")}
            </motion.div>
          ) : (
            // Testimonials
            <motion.div
              key="cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col"
            >
              {/* Small import buttons */}
              {renderPlatformButtons("small")}

              {/* Horizontal Cards */}
              <div className="flex gap-4 overflow-x-auto py-4">
                {twitterTestimonials.map((t) => (
                  <div
                    key={t._id}
                    className="relative bg-gray-900 text-white rounded-xl shadow-lg w-[320px] p-4 flex-shrink-0 flex flex-col space-y-3"
                  >
                    {/* Top Section */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <img
                          src={t.avatar}
                          alt={t.twitterData.twitterName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-sm font-semibold">
                            {t.twitterData.twitterName}
                          </h3>
                          <p className="text-xs text-gray-400">
                            @{t.twitterData.twitterHandle}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Star
                          size={18}
                          className="text-purple-400 cursor-pointer"
                        />
                        <Heart
                          size={18}
                          className="text-red-400 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Tweet Content */}
                    <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line">
                      {t.text}
                    </p>

                    {/* Bottom Section */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Heart size={14} className="text-red-400" />
                        <span>{t.twitterData.likeCount}</span>
                        <span className="ml-2">
                          {dayjs(t.createdAt).format("MMM D, YYYY")}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <span>Imported from:</span>
                        <FaXTwitter size={14} />
                      </div>
                    </div>

                    {/* Expand/Collapse Button */}
                    <div className="absolute bottom-2 right-2">
                      <button
                        onClick={() => toggleExpand(t._id)}
                        className="text-gray-300 hover:text-gray-100 transition"
                      >
                        <ChevronUp
                          className={`w-5 h-5 transition-transform duration-300 ${
                            expandedCardId === t._id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Expandable Options */}
                    <AnimatePresence>
                      {expandedCardId === t._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="mt-3 flex justify-center gap-3"
                        >
                          <button className="px-3 py-1 text-xs rounded-md hover:bg-gray-700 transition">
                            Share
                          </button>
                          <button
                            onClick={() => handleToDelete(t)}
                            className="px-3 py-1 text-xs rounded-md hover:bg-gray-700 transition"
                          >
                            Delete
                          </button>
                          <button className="px-3 py-1 text-xs rounded-md hover:bg-gray-700 transition">
                            Download
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )
        ) : (
          <p className="text-gray-400 text-center w-full">
            {activePlatform} integration coming soon
          </p>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ImportFromTwitterModal
        isOpen={showIntegrationModal}
        onClose={() => setShowIntegrationModal(false)}
        onSubmit={(data) => {
          console.log("Submitted Tweet Import Data:", data);
          setShowIntegrationModal(false);
        }}
      />

      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
      />
    </div>
  );
}
