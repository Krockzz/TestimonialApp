import { json, useLoaderData } from "@remix-run/react";
import Lottie from "lottie-react";
import sprinkle from "../../utilities/sprinkle.json"
import { FaStar } from "react-icons/fa";

const API_URI = import.meta.env.VITE_API_URL;

export const handle = {
  skipLayout: true,
};

export const loader = async ({ request, params }) => {
  const cookie = request.headers.get("Cookie");
  const ID = params.TestimonialId;

  if (!ID) {
    throw new Response("Invalid testimonial ID", { status: 400 });
  }

  try {
    const response = await fetch(
      `${API_URI}/api/v1/users/Testimonial/getTestimonial/${ID}`,
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

export default function Show() {
  const { result } = useLoaderData();
  const testimonial = result["data"];
  const isVideo = Boolean(testimonial?.videoURL);

  return (
    <>
    {/* <Lottie animationData={sprinkle} /> */}
    <div className={`min-h-screen ${isVideo ? "bg-black" : "bg-white"} flex items-center justify-center px-4`}>
      {/* Top-left heading (branding) */}
      <div className="absolute top-6 left-6 flex items-center space-x-1">
        <h1 className={`text-2xl font-extrabold ${isVideo ? "text-white" : "text-blue-600"}`}>
          TestimonialApp
        </h1>
      </div>

      {isVideo ? (
        <div className="relative flex flex-col items-center justify-center w-full max-w-[800px] animate-fade-in-up">
  <video
    src={testimonial.videoURL}
    controls
    className="w-full rounded-xl mb-6"
  />

  
  <div className="absolute bottom-[70px] right-4 flex items-center gap-3  px-3 py-1 rounded-lg">
    {testimonial?.avatar && (
      <img
        src={testimonial.avatar}
        alt="Avatar"
        className="w-10 h-10 rounded-full object-cover"
      />
    )}
    <p className="text-white font-medium">{testimonial.name}</p>
  </div>
</div>

      ) : (
        <div className="w-[1000px] border-[5px] border-blue-500 rounded-xl p-8 text-center animate-fade-in-up">
          <h1 className="text-2xl font-bold mb-5 text-blue-600">TestimonialApp</h1>

          {testimonial?.space.avatar && (
            <img
              src={testimonial.space.avatar}
              alt="Avatar"
              className="w-28 h-28 rounded-full mx-auto mb-5 object-cover"
            />
          )}

             <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`mx-1 text-xl ${
                            index < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

          <p className="text-gray-700 text-lg mb-4">
            "{testimonial?.text || "No testimonial found."}"
          </p>

          <div className="flex items-center justify-center gap-3">
            {testimonial?.avatar && (
              <img
                src={testimonial.avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
            )}

          
            <p className="text-black font-semibold">{testimonial.name}</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
