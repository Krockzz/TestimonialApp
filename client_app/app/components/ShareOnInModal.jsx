import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";

export default function ShareOnLinkedInModal({ testimonial, onClose }) {
  const [loading, setLoading] = useState(false);

  const shareUrl = `${window.location.origin}/${testimonial._id}/show`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const handleShare = () => {
    setLoading(true);

    setTimeout(() => {
      window.open(linkedInShareUrl, "_blank", "noopener,noreferrer");
      setLoading(false);
    }, 3000); // Optional delay to show loader
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-[480px] animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 transition text-xl"
        >
          &times;
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Share on LinkedIn</h2>
        <p className="text-gray-500 text-sm mb-5 leading-relaxed">
          We'll help you share this testimonial on your LinkedIn profile. You can still edit the post there.
        </p>

        {/* Preview */}
        <div className="bg-gray-100 border border-gray-200 p-4 rounded-lg text-sm text-blue-700 break-words font-medium mb-6 max-h-[200px] overflow-auto">
          {shareUrl}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={loading}
            className={`text-sm px-4 py-2 bg-[#0077B5] hover:bg-[#005f8c] text-white font-semibold rounded-md transition flex items-center justify-center min-w-[140px] ${
              loading ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin mr-2 text-white text-base" />
                Sharing...
              </>
            ) : (
              "Share Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
