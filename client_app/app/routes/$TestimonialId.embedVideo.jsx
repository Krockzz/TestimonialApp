import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useRef , useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
const API_URI = import.meta.env.VITE_API_URL;

export const handle = {
  skipLayout: true,
};

export const loader = async ({request , params}) => {
    const cookie = request.headers.get("Cookie")
    const ID = params.TestimonialId

    if(!ID){
        throw new Response("Invalid ID" , {statusCode : 404})
    }

    try{
        const response = await fetch(`${API_URI}/api/v1/users/Testimonial/getTestimonial/${ID}` , 
            {
                method: "GET",
                headers : {
                    "Content-Type": "application/json",
                    Cookie: cookie,
                },

                credentials: "include"
            }
        );

        const result = await response.json();
        if(!result){
            throw new Response("Something went wrong while fetching the testimonial")
        }

        return json({result});

    }
    catch(err){
        console.log("This is err which has occured:" , err);
        return json("Failed to load the testimonial" , {statusCode : 404})

    }
} 

export default function VideoFullScreen() {
  const { result } = useLoaderData();
  const testimonial = result.data;
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!testimonial?.videoURL) return <p>No video available.</p>;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Video */}
      <video
        ref={videoRef}
        src={testimonial.videoURL}
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />

      {/* Center Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 m-auto w-20 h-20 flex items-center justify-center rounded-full bg-black/40 text-white text-3xl hover:bg-black/60 transition-opacity duration-300"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 text-blue-600 font-bold text-lg opacity-80 pointer-events-none">
        TestimonialApp
      </div>
    </div>
  );
}