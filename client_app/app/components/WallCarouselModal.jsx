import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import WallCarousel from "./WallCarousel";

export default function WallOfLoveModal({
  featuredTestimonials,
  spaceId,
  onClose,
  spaceDetails
}) {
  const [theme, setTheme] = useState("dark");
  const [bg, setBg] = useState("#4f46e5");
  const [cardSize, setCardSize] = useState("medium");
  const [mode, setMode] = useState("manual");
  const [activePanel, setActivePanel] = useState("theme");

  const presetColors = [
    "#f97316", "#eab308", "#10b981", "#06b6d4",
    "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899",
    "#f43f5e", "#111827", "#1f2937", "transparent"
  ];

  const limitedTestimonials = featuredTestimonials.slice(0, 5);

  const iframeCode = useMemo(() => {
    const baseUrl = `${window.location.origin}`;

    const params = new URLSearchParams({
      spaceId,
      theme,
      cardSize,
      bg,
      mode
    }).toString();

    return `<iframe src="${baseUrl}/${spaceId}/embed/carousel?${params}" width="100%" height="350" style="border:none;border-radius:12px;" loading="lazy"></iframe>`;
  }, [spaceId, theme, cardSize, bg, mode]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-indigo-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Wall of Love</h2>
            <p className="text-sm text-gray-500">Showcase your best testimonials beautifully</p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar */}
          <div className="w-1/3 border-r px-5 py-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">

            {/* 🔥 Title Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Customize Wall</h3>
              <p className="text-xs text-gray-500 mt-1">Control appearance and behavior</p>
            </div>
            <div className="space-y-2 mb-6">
              {[
                { key: "theme", label: "Theme" },
                { key: "background", label: "Background" },
                { key: "size", label: "Card Size" },
                { key: "carousel", label: "Carousel" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActivePanel(tab.key)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activePanel === tab.key
                      ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-6">

              {activePanel === "theme" && (
                <div>
                  <p className="text-sm font-semibold mb-2">Theme</p>
                  <div className="flex gap-3">
                    {["light", "dark"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex-1 py-2 rounded-xl text-sm transition ${
                          theme === t
                            ? "bg-black text-white shadow"
                            : "bg-gray-100 hover:bg-gray-200 text-black"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === "background" && (
                <div>
                  <p className="text-sm font-semibold mb-2">Background</p>
                  <div className="grid grid-cols-4 gap-3">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setBg(color)}
                        className={`w-full h-10 rounded-lg border transition ${
                          bg === color ? "ring-2 ring-indigo-500 scale-105" : ""
                        }`}
                        style={{ background: color === "transparent" ? "#fff" : color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activePanel === "size" && (
                <div>
                  <p className="text-sm font-semibold mb-2">Card Size</p>
                  <div className="flex gap-2">
                    {["small", "medium", "large"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setCardSize(size)}
                        className={`flex-1 py-2 rounded-xl text-sm transition ${
                          cardSize === size
                            ? "bg-black text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === "carousel" && (
                <div>
                  <p className="text-sm font-semibold mb-2">Carousel Mode</p>
                  <div className="flex gap-2">
                    {["manual", "auto"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 py-2 rounded-xl text-sm transition ${
                          mode === m
                            ? "bg-black text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-black"
                        }`}
                      >
                        {m === "manual" ? "Manual" : "Auto"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

            

          </div>

          <div className="flex-1 p-6 overflow-y-auto">

            <div
              className="rounded-2xl p-6 shadow-inner mb-6 transition"
              style={{ background: bg === "transparent" ? "transparent" : bg }}
            >
              <WallCarousel
                testimonials={limitedTestimonials}
                theme={theme}
                cardSize={cardSize}
                mode={mode}
                spaceDetails={spaceDetails}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Embed Code
              </label>

              <div className="bg-black text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                <code>{iframeCode}</code>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(iframeCode);
                  toast.success("Copied!");
                }}
                className="mt-4 bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-xl text-sm"
              >
                Copy Code
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}