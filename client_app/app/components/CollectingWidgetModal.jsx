import { useState, useMemo } from "react";
import { Link } from "@remix-run/react";
import { X, Moon, Sun, Copy, Video, Edit3 } from "lucide-react";

export default function CollectingWidgetModal({
  open,
  onClose,
  spaceName = "Language Space",
  spaceAvatar,
  spaceId,
}) {
  const [dark, setDark] = useState(false);
  const [copied, setCopied] = useState(false);

  const widgetUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/widget/${spaceId}${dark ? "?theme=dark" : ""}`;
  }, [spaceId, dark]);

  const embedCode = useMemo(() => {
    return `<iframe
  src="${widgetUrl}"
  style="border:none"
  width = "400"
  height = "600"
  loading="lazy">
</iframe>`;
  }, [widgetUrl]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-xl transition-colors ${
          dark ? "bg-neutral-900 text-white" : "bg-white text-gray-900"
        }`}
      >
       
        <div className="flex items-center justify-between p-5 border-b border-black/10 dark:border-white/10">
          <h2 className="text-lg font-semibold">Add collecting widget to this space</h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark((p) => !p)}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button onClick={onClose} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* Space Info */}
          <div className="flex items-center gap-4">
            <img
              src={spaceAvatar || "https://api.dicebear.com/7.x/shapes/svg?seed=space"}
              alt="space"
              className="w-14 h-14 rounded-full border object-cover"
            />
            <div>
              <p className="font-semibold text-base">{spaceName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Public collecting widget</p>
            </div>
          </div>

          {/* Questions */}
          <div>
            <h3 className="font-semibold mb-2">Questions</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300 dark:text-gray-500">
              <li>Who are you / what are you working on?</li>
              <li>How has our product helped you?</li>
              <li>What is the best thing about our service?</li>
            </ul>
          </div>

          {/* Widget Preview */}
          <div
            className={`rounded-xl p-6 border transition-colors ${
              dark ? "bg-neutral-800 border-white/10" : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="text-center space-y-5">
              <p className="font-medium">Share your thoughts without any concern</p>

              <div className="flex justify-center gap-4">
                
                <Link
                  to={`/${spaceId}`}
                  onClick={onClose}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium ${
                    dark ? "bg-blue-600" : "bg-blue-500"
                  } text-white`}
                >
                  <Video size={16} /> Record a Video
                </Link>

              
                <Link
                  to={`/${spaceId}`}
                  onClick={onClose}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium ${
                    dark ? "bg-neutral-700" : "bg-gray-800"
                  } text-white`}
                >
                  <Edit3 size={16} /> Send a Text
                </Link>
              </div>
            </div>
          </div>

          {/* Embed Code */}
          <div className="space-y-2">
            <p className="font-medium text-sm">Embed code</p>

            <div
              className={`relative rounded-lg border p-4 text-xs font-mono whitespace-pre-wrap ${
                dark
                  ? "bg-black border-white/10 text-gray-200"
                  : "bg-gray-100 border-gray-200 text-gray-800"
              }`}
            >
              {embedCode}

              <button
                onClick={handleCopy}
                className={`absolute top-2 right-2 flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                  dark ? "bg-white/10 hover:bg-white/20" : "bg-white hover:bg-gray-100 border"
                }`}
              >
                <Copy size={12} />
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
