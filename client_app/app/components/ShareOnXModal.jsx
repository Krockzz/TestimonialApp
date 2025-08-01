import { useState } from "react";
import { ImSpinner2 } from "react-icons/im";

export default function ShareOnXModal({ testimonial, onClose }) {
  const [loading, setLoading] = useState(false);

  const tweetText = `Wow! We just received a testimonial 🥳 Check it out! 
  ${window.location.origin}/${testimonial._id}/show via @Testimonia`;

  const handleTweet = () => {
    setLoading(true);
    const encodedTweet = encodeURIComponent(tweetText);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodedTweet}`;

    // Optional delay for polish
    setTimeout(() => {
      window.open(tweetUrl, "_blank", "noopener,noreferrer");
      setLoading(false);
    }, 3000);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Share on X</h2>
        <p className="text-gray-500 text-sm mb-5 leading-relaxed">
          Crafting the perfect tweet for you. Feel free to customize it before posting!
        </p>

        {/* Tweet Preview */}
        <div className="bg-gray-100 border border-gray-200 p-4 rounded-lg text-sm whitespace-pre-wrap font-mono text-gray-800 mb-6 max-h-[200px] overflow-auto">
          {tweetText}
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
            onClick={handleTweet}
            disabled={loading}
            className={`text-sm px-4 py-2 bg-[#1DA1F2] hover:bg-[#1991DA] text-white font-semibold rounded-md transition flex items-center justify-center min-w-[120px] ${
              loading ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin mr-2 text-white text-base" />
                Tweeting...
              </>
            ) : (
              "Tweet Now"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
