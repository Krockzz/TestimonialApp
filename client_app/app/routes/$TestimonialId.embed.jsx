import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useMemo } from "react";
import { FaStar } from "react-icons/fa";
import { useEffect } from "react";

const API_URI = import.meta.env.VITE_API_URL;

export const handle = {
  skipLayout: true,
};

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
    console.log({result});
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

  // const avatar = decodeURIComponent(searchParams.get("avatar") || "");

 useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/iframe-resizer/js/iframeResizer.min.js";
  script.async = true;
  document.head.appendChild(script);

  return () => {
    document.head.removeChild(script); 
  };
}, []);

  


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
      // avatar: avatar
    };
  }, [searchParams]);

  const isVideo = Boolean(testimonial?.videoURL);

  return (
   
    !isVideo && 
    (
      <div
      className="w-full h-full m-0 p-0 overflow-hidden"
      style={{
        fontFamily: design.fontFamily,
        color: design.textColor,
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          border: `${design.borderWidth}px solid ${design.borderColor}`,
          borderRadius: design.borderRadius,
          padding: "24px",
          backgroundColor: design.cardColor,
          boxSizing: "border-box",
          width: "600px",
          height: "100%",
        }}
      >
        {design.designStyle === "center" && (
          <div className="flex flex-col items-center text-center">
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
            <p className="text-blue-600 font-semibold text-sm mt-2">TestimonialApp</p>
          </div>
        )}

        {design.designStyle === "largeImage" && (
          <div className="flex gap-6">
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
              <p className="text-blue-600 font-semibold text-sm mt-2">TestimonialApp</p>
            </div>
            <img
              src={testimonial.avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-40 h-40 rounded-xl object-cover border"
            />
          </div>
        )}

        {(design.designStyle === "left" || design.designStyle === "bold") && (
          <>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={18}
                  className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            {isVideo ? (
              <video
                src={testimonial.videoURL}
                className="w-full h-full object-cover rounded-md border border-yellow-400 mb-4"
                controls
              />
            ) : (
              <p className={`text-lg italic mb-4 ${design.designStyle === "bold" ? "font-bold" : "font-medium"}`}>
                “{testimonial.text}”
              </p>
            )}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <p className="font-bold text-gray-800">— {testimonial.name}</p>
              </div>
              <p className="text-blue-600 font-semibold text-lg">TestimonialApp</p>
            </div>
          </>
        )}
      </div>
    </div>
    ) 

    
  );
}
