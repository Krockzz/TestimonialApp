import {useState, useMemo } from "react";
import { Palette, Square, Image, Type, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";

const BORDER_COLORS = [
  "#F97316", "#FACC15", "#6EE7B7", "#34D399",
  "#93C5FD", "#3B82F6", "#9CA3AF", "#EC4899",
  "#F9A8D4", "#818CF8", "#00D084"
];

const FONT_FAMILIES = [
  { label: "Sans", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Mono", value: "monospace" },
  { label: "Inter", value: "'Inter', sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" }
];

const BORDER_RADIUS_OPTIONS = [
  { label: "None", value: "0px" },
  { label: "Small", value: "10px" },
  { label: "Medium", value: "20px" },
  { label: "Large", value: "30px" }
];

export default function EmbedTestimonialModal({ testimonial, avatar, onClose }) {
  const [borderWidth, setBorderWidth] = useState(30);
  const [selectedOption, setSelectedOption] = useState("design");
  const [textColor, setTextColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [borderColor, setBorderColor] = useState("#3B82F6");
  const [borderRadius, setBorderRadius] = useState("0px");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [cardColor, setCardColor] = useState("#ffffff");
  const [designStyle, setDesignStyle] = useState("left");

  

  const iframeCode = useMemo(() => {
    const queryParams = new URLSearchParams({
      borderColor,
      borderWidth: borderWidth.toString(),
      borderRadius,
      textColor,
      fontFamily,
      designStyle,
      cardColor,
      backgroundColor,
      // avatar: encodeURIComponent(testimonial.avatar || avatar || "")
    }).toString();

    const id = testimonial._id;
    const publicLink = `${window.location.origin}/${id}/embed`;

    return `<iframe src="${publicLink}?${queryParams}" width="600" height="350" style="border:none;" loading="lazy"></iframe>`;
  },[testimonial._id, borderColor, borderWidth, borderRadius, textColor, fontFamily]);

  const isVideo = Boolean(testimonial.videoURL);

  const options = [
    { name: "design", label: "Design", icon: <Palette className="w-6 h-6" /> },
    { name: "border", label: "Border", icon: <Square className="w-6 h-6" /> },
    { name: "background", label: "Background", icon: <Image className="w-6 h-6" /> },
    { name: "text", label: "Text", icon: <Type className="w-6 h-6" /> },
  ];

  

  return (

    !isVideo && ( <div className="fixed inset-0 z-[9999] bg-black/40  flex items-center justify-center px-4 pointer-events-none">
      <div className="bg-white text-black rounded-2xl p-8 w-full max-w-4xl h-[90vh] overflow-y-auto relative shadow-2xl pointer-events-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>

        <h2 className="text-xl mb-6 text-gray-800">Embed this testimonial to your website</h2>

        <div className=" inline-block mb-6 rounded-xl bg-gray-200 shadow-sm border border-gray-300 px-6 py-3">
          <h2 className="text-[12px] font-semibold text-gray-800 flex items-center gap-2 bg-white p-2 rounded-md">
            <span className="text-sm">🎨</span> Advanced
          </h2>
        </div>

        <div className="grid grid-cols-4 gap-10 w-full bg-gray-100 rounded-md p-3 mb-8">
          {options.map((item) => (
            <button
              key={item.name}
              onClick={() => setSelectedOption(item.name)}
              className={`flex flex-col items-center justify-center border rounded-lg p-4 text-gray-700 transition ${
                selectedOption === item.name
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white hover:bg-gray-50"
              }`}
            >
              <div className="mb-2">{item.icon}</div>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {selectedOption === "design" && (
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-800">Design Layout</label>
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { label: "Left Align", value: "left" },
                { label: "Left Align Bold", value: "bold" },
                { label: "Large Image", value: "largeImage" },
                { label: "Centered", value: "center" },
              ].map((style) => (
                <button
                  key={style.value}
                  onClick={() => setDesignStyle(style.value)}
                  className={`px-4 py-2 rounded-md text-sm border transition ${
                    designStyle === style.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

            <label className="block text-sm font-semibold mb-2 text-gray-800">Card Margin</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="65"
                value={borderWidth}
                onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                className="w-full appearance-none bg-gray-200 h-2 rounded-lg
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-blue-500
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="text-sm font-medium text-gray-700">{borderWidth}px</div>
            </div>
          </div>
        )}

        {selectedOption === "border" && (
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-800">Border Radius</label>
            <div className="flex gap-4 mb-4">
              {BORDER_RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setBorderRadius(opt.value)}
                  className={`px-4 py-2 rounded-md text-sm border transition ${
                    borderRadius === opt.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-800">Border Color</label>
              <button
                onClick={() => setBorderColor("#3B82F6")}
                className="w-7 h-7 p-1 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                <RotateCcw size={16} className="text-gray-700" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              {BORDER_COLORS.map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-md border-2 cursor-pointer"
                  style={{
                    backgroundColor: color,
                    borderColor: borderColor === color ? "#000" : "transparent"
                  }}
                  onClick={() => setBorderColor(color)}
                />
              ))}
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">#</span>
                <input
                  type="text"
                  value={borderColor.replace("#", "")}
                  onChange={(e) => setBorderColor(`#${e.target.value}`)}
                  className="w-20 border text-sm px-2 py-1 rounded-md border-gray-300"
                />
              </div>
            </div>
          </div>
        )}

        {selectedOption === "background" && (
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-800">Preview Background Color</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {BORDER_COLORS.map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-md cursor-pointer border-2"
                  style={{
                    backgroundColor: color,
                    borderColor: backgroundColor === color ? "#000" : "transparent",
                  }}
                  onClick={() => setBackgroundColor(color)}
                />
              ))}
            </div>

            <label className="block text-sm font-semibold mb-2 text-gray-800">Card Background Color</label>
            <div className="flex flex-wrap gap-2">
              {BORDER_COLORS.map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-md cursor-pointer border-2"
                  style={{
                    backgroundColor: color,
                    borderColor: cardColor === color ? "#000" : "transparent",
                  }}
                  onClick={() => setCardColor(color)}
                />
              ))}
            </div>
          </div>
        )}

        {selectedOption === "text" && (
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-800">Text Color</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {BORDER_COLORS.map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-md cursor-pointer border-2"
                  style={{
                    backgroundColor: color,
                    borderColor: textColor === color ? "#000" : "transparent",
                  }}
                  onClick={() => setTextColor(color)}
                />
              ))}
            </div>

            <label className="block text-sm font-semibold mb-2 text-gray-800">Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-48 p-2 border border-gray-300 rounded-md text-sm bg-white"
            >
              {FONT_FAMILIES.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-8 w-full flex justify-center relative" style={{ backgroundColor }}>
          <div
            className="transition-all duration-300 relative shadow-inner"
            style={{
              width: "900px",
              height: "400px",
              backgroundColor: cardColor,
              border: `${borderWidth}px solid ${borderColor}`,
              borderRadius,
              padding: "24px",
              fontFamily,
              color: textColor,
              display: "flex",
              flexDirection: designStyle === "largeImage" ? "row" : "column",
              justifyContent: "space-between",
              alignItems: designStyle === "center" ? "center" : "flex-start",
              textAlign: designStyle === "center" ? "center" : "left",
              gap: designStyle === "largeImage" ? "24px" : "0",
            }}
          >
            {designStyle === "center" && (
              <>
                <div className="mb-2 flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={20}
                      className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <img
                  src={testimonial.avatar || avatar}
                  className="w-20 h-20 rounded-full mb-4 object-cover"
                  alt="avatar"
                />
                <p className="text-base font-medium italic">“{testimonial.text}”</p>
                <p className="mt-2 font-bold">— {testimonial.name}</p>
              </>
            )}

            {designStyle === "largeImage" && (
              <>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="mb-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={22}
                        className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-base italic ${
                      designStyle === "bold" ? "font-bold" : "font-medium"
                    }`}
                  >
                    “{testimonial.text}”
                  </p>
                  <p className="mt-4 font-bold">— {testimonial.name}</p>
                </div>
                <img
                  src={testimonial.avatar || avatar}
                  className="w-44 h-44 rounded-xl object-cover"
                  alt="avatar"
                />
              </>
            )}

            {(designStyle === "left" || designStyle === "bold") && (
              <>
                <div className="mt-4 mb-3 flex items-center justify-start gap-1.5 pl-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={24}
                      className={`transition-transform duration-200 ${
                        i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {isVideo ? (
                  <video
                    src={testimonial.videoURL}
                    className="w-full h-full object-cover rounded-md border border-yellow-400"
                    controls
                  />
                ) : (
                  <>
                    <p className={`text-lg italic ${designStyle === "bold" ? "font-bold" : "font-medium"}`}>
                      “{testimonial.text}”
                    </p>
                  </>
                )}

                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <img
                      src={testimonial.avatar || avatar}
                      alt="avatar"
                      className="rounded-full w-14 h-14"
                    />
                    <p className="font-bold">— {testimonial.name}</p>
                  </div>
                  <p className="text-blue-500 text-[15px] font-semibold mt-[16px] ">TestimonialApp</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="w-full max-w-4xl mt-10">
  <label className="block text-lg font-semibold text-gray-800 mb-2">
    Embed code
  </label>

  <div className="bg-[#1e1e1e] rounded-md border border-gray-700 p-4 overflow-x-auto text-sm font-mono leading-6 text-gray-300 whitespace-pre-wrap">
    <code>
      <span className="text-gray-400">&lt;iframe </span>
      <span className="text-green-400">src=</span>
      <span className="text-green-300">
        "{iframeCode.match(/src="([^"]+)"/)?.[1] || iframeCode}"
      </span>{" "}
      <span className="text-green-400">width=</span>
      <span className="text-green-300">"600"</span>{" "}
      <span className="text-green-400">height=</span>
      <span className="text-green-300">"350"</span>{" "}
      <span className="text-green-400">style=</span>
      <span className="text-green-300">"border:none;"</span>{" "}
      <span className="text-green-400">loading=</span>
      <span className="text-green-300">"lazy"</span>
      <span className="text-gray-400">&gt;&lt;/iframe&gt;</span>
    </code>
  </div>

  <button
    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md shadow-md"
    onClick={() => {
      navigator.clipboard.writeText(iframeCode);
      toast.success("Embed code copied!");
    }}
  >
    Copy Embed Code
  </button>
</div>




      </div>
    </div>)
   
  );
}
