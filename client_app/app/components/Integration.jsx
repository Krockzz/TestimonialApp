import { useState } from "react";
import { Download, Heart, Star, ChevronUp } from "lucide-react";
import { FaXTwitter, FaReddit } from "react-icons/fa6";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { useSubmit } from "@remix-run/react";
import Featured from "./FeaturedHeart.jsx";

import IntegrationModal from "../components/IntegrationModal.jsx";
import ConfirmModal from "./ConfirmModal.jsx";

export default function Integration({
  twitterTestimonials = [],
  redditTestimonials = [],
}) {
  const [activePlatform, setActivePlatform] = useState("twitter");
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [integrationPlatform, setIntegrationPlatform] = useState(null);
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

  const platforms = [
    { label: "Twitter", icon: <FaXTwitter size={18} />, key: "twitter" },
    { label: "Reddit", icon: <FaReddit size={18} />, key: "reddit" },
  ];

  const renderPlatformButtons = (size = "md") => (
    <div
      className={`flex flex-wrap gap-3 ${
        size === "center" ? "justify-center mt-4" : "justify-start mb-5"
      }`}
    >
      {platforms.map((p) => (
        <button
          key={p.key}
          onClick={() => {
            setActivePlatform(p.key);
            setIntegrationPlatform(p.key);
            setShowIntegrationModal(true);
          }}
          className="flex items-center gap-2 rounded-lg border border-gray-700 
          bg-gray-900 hover:bg-gray-800 transition px-4 py-2 text-sm"
        >
          {p.icon}
          <span>{p.label}</span>
        </button>
      ))}
    </div>
  );

  const getAvatar = (t) => {
    if (t.sourceType === "twitter") return t.avatar;
    if (t.sourceType === "reddit") return t.redditData?.thumbnail || null;
    return null;
  };

  const getName = (t) => {
    if (t.sourceType === "twitter") return t.twitterData.twitterName;
    if (t.sourceType === "reddit") return t.redditData?.author;
    return "Anonymous";
  };

  const getHandle = (t) => {
    if (t.sourceType === "twitter")
      return `@${t.twitterData.twitterHandle}`;
    if (t.sourceType === "reddit")
      return `r/${t.redditData?.subreddit}`;
    return "";
  };

  const getLikes = (t) => {
    if (t.sourceType === "twitter") return t.twitterData.likeCount;
    if (t.sourceType === "reddit") return t.redditData?.upvotes || 0;
    return 0;
  };

  const getText = (t) => {
    if (t.sourceType === "reddit")
      return t.redditData?.text || t.text;
    return t.text;
  };

  const getSourceIcon = (t) => {
    if (t.sourceType === "twitter") return <FaXTwitter size={14} />;
    if (t.sourceType === "reddit") return <FaReddit size={14} />;
    return null;
  };

  const testimonials =
    activePlatform === "twitter"
      ? twitterTestimonials
      : redditTestimonials;

  /* ---------------- UI ---------------- */

  return (
    <div className="w-full h-auto bg-gray-950 text-white flex flex-col px-6 py-6">
      {/* Header */}
      <div className="text-3xl font-bold mb-2">
        Social media testimonials
      </div>
      <p className="text-gray-400 mb-10 max-w-md">
        Import and track testimonials across social media.
      </p>

      <AnimatePresence mode="wait">
        {testimonials.length === 0 ? (
          /* ---------- EMPTY STATE ---------- */
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

            <h2 className="text-xl font-semibold">Import from</h2>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              Select a platform to import testimonials
            </p>

            {renderPlatformButtons("center")}
          </motion.div>
        ) : (
          /* ---------- CARDS ---------- */
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col"
          >
            {renderPlatformButtons("small")}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 
                gap-6 items-start auto-rows-min">

              {testimonials.map((t) => (
               <motion.div
  key={t._id}
  layout
  whileHover={{ scale: 1.02 }}
  className="relative bg-gray-900 rounded-2xl shadow-xl
    p-5 w-full flex flex-col h-fit"
>

                  {/* Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      {getAvatar(t) ? (
                        <img
                          src={getAvatar(t)}
                          alt={getName(t)}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-700"
                        />
                      ) : (
                        <div
                          className="w-11 h-11 rounded-full 
                          bg-gradient-to-br from-indigo-500 to-purple-600
                          flex items-center justify-center font-bold"
                        >
                          {getName(t)?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}

                      <div>
                       <div className="text-sm font-semibold break-all leading-tight">
  {getName(t)}
</div>

<div className="text-xs text-gray-400 break-all">
  {getHandle(t)}
</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Star className="w-4 h-4 text-purple-400 hover:scale-110 transition" />
                      <Featured testimonial={t} />
                    </div>
                  </div>

                  {/* Content */}
                  <p
                    className="text-sm text-gray-200 leading-relaxed mt-3
                    whitespace-pre-wrap break-words"
                  >
                    {getText(t)}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-3 mt-4 border-t border-gray-700 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <Heart size={13} className="text-red-400" />
                      <span>{getLikes(t)}</span>
                      <span>
                        {dayjs(t.createdAt).format("MMM D, YYYY")}
                      </span>
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => toggleExpand(t._id)}
                      className="ml-auto text-gray-400 hover:text-white"
                    >
                      <ChevronUp
                        className={`transition-transform ${
                          expandedCardId === t._id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Expand Area */}
                  <AnimatePresence>
                    {expandedCardId === t._id && (
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 flex justify-center gap-4"
                      >
                        <button className="text-xs hover:text-indigo-400">
                          Share
                        </button>
                        <button
                          onClick={() => handleToDelete(t)}
                          className="text-xs hover:text-red-400"
                        >
                          Delete
                        </button>
                        <button className="text-xs hover:text-green-400">
                          Download
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <IntegrationModal
        isOpen={showIntegrationModal}
        onClose={() => setShowIntegrationModal(false)}
        platform={integrationPlatform}
      />

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this testimonial?"
      />
    </div>
  );
}