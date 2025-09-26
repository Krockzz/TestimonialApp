import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useMemo, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";

const API_URI = import.meta.env.VITE_API_URL;

export const handle = {
  skipLayout: true,
};

// Loader to fetch testimonial by ID
export const loader = async ({ request, params }) => {
  const cookie = request.headers.get("Cookie");
  const testimonialId = params.TestimonialId;

  if (!testimonialId) {
    throw new Response("Invalid testimonial ID", { status: 400 });
  }

  try {
    const response = await fetch(
      `${API_URI}/api/v1/users/Testimonial/getTestimonial/${testimonialId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
        credentials: "include",
      }
    );

    const result = await response.json();
    return json({ result });
  } catch (err) {
    console.error("Failed to fetch testimonial:", err);
    throw new Response("Failed to load testimonial", { status: 500 });
  }
};

export default function EmbedTestimonialPage() {
  const { result } = useLoaderData();
  const testimonial = result.data;
  const [searchParams] = useSearchParams();
  const wrapperRef = useRef(null);

  // Dynamically calculate and apply scaling
  useEffect(() => {
    const wrapper = wrapperRef.current;

    function scaleContent() {
      if (!wrapper) return;

      const parentWidth = wrapper.offsetWidth;
      const parentHeight = wrapper.offsetHeight;

      const baseWidth = 600; // Default design width
      const baseHeight = 350; // Default design height

      // Calculate scale for both dimensions
      const scaleX = parentWidth / baseWidth;
      const scaleY = parentHeight / baseHeight;

      // Use the smaller scale so nothing overflows
      const scale = Math.min(scaleX, scaleY);

      wrapper.style.transform = `scale(${scale})`;
    }

    // Run on load and whenever the window resizes
    scaleContent();
    window.addEventListener("resize", scaleContent);

    return () => window.removeEventListener("resize", scaleContent);
  }, []);

  // Design customization
  const design = useMemo(() => {
    return {
      borderColor: searchParams.get("borderColor") || "#3B82F6",
      borderWidth: parseInt(searchParams.get("borderWidth") || "12", 10),
      borderRadius: searchParams.get("borderRadius") || "8px",
      textColor: searchParams.get("textColor") || "#000000",
      fontFamily: searchParams.get("fontFamily") || "sans-serif",
      designStyle: searchParams.get("designStyle") || "left",
      cardColor: searchParams.get("cardColor") || "#ffffff",
      backgroundColor: searchParams.get("backgroundColor") || "#ffffff",
    };
  }, [searchParams]);

  return (
    <div
      className="w-screen h-screen flex items-center justify-center overflow-hidden bg-white"
      style={{
        fontFamily: design.fontFamily,
        color: design.textColor,
      }}
    >
      {/* Scaling container */}
      <div
        className="relative"
        ref={wrapperRef}
        style={{
          width: "100%",
          height: "100%",
          transformOrigin: "top left",
        }}
      >
        {/* Fixed base size for scaling */}
        <div
          style={{
            width: "600px",
            height: "350px",
            border: `${design.borderWidth}px solid ${design.borderColor}`,
            borderRadius: design.borderRadius,
            padding: "24px",
            backgroundColor: design.cardColor,
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Watermark */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              right: "12px",
              color: "#3B82F6",
              fontWeight: "bold",
              fontSize: "14px",
              opacity: 0.7,
            }}
          >
            TestimonialApp
          </div>

          {/* Center Style */}
          {design.designStyle === "center" && (
            <div className="flex flex-col items-center text-center h-full justify-center">
              <div className="mb-2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={18}
                    className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <img
                src={testimonial.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-20 h-20 rounded-full mb-4 object-cover border"
              />
              <p className="italic text-base">“{testimonial.text}”</p>
              <p className="mt-2 font-bold">— {testimonial.name}</p>
            </div>
          )}

          {/* Large Image Style */}
          {design.designStyle === "largeImage" && (
            <div className="flex gap-6 h-full items-center">
              <div className="flex-1">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={18}
                      className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className="italic text-base">“{testimonial.text}”</p>
                <p className="mt-2 font-bold">— {testimonial.name}</p>
              </div>
              <img
                src={testimonial.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-40 h-40 rounded-xl object-cover border"
              />
            </div>
          )}

          {/* Left / Bold Styles */}
          {(design.designStyle === "left" || design.designStyle === "bold") && (
            <div className="flex flex-col justify-center h-full">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={18}
                    className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <p
                className={`text-lg italic mb-4 ${
                  design.designStyle === "bold" ? "font-bold" : "font-medium"
                }`}
              >
                “{testimonial.text}”
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <p className="font-bold text-gray-800">— {testimonial.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
