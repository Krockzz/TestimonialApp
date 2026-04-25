import { useEffect, useState } from "react";
import { Copy, ExternalLink, Pencil } from "lucide-react";

export default function WallOfLovePanel({ spaceId }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}/wall/${spaceId}`);
    }
  }, [spaceId]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
     
      <div>
        <h1 className="text-2xl font-semibold">Public Page</h1>
        <p className="text-gray-400 mt-1">View and share your Public Page</p>
      </div>

      <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-5 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2 overflow-hidden">
          <p className="text-sm text-gray-300 font-medium">
            On our hosted page
          </p>

          <p className="text-blue-400 text-sm truncate">{url}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition"
            title="Copy link"
          >
            <Copy className="w-4 h-4" />
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {copied && (
        <p className="text-green-400 text-sm">Link copied to clipboard ✅</p>
      )}
    </div>
  );
}
