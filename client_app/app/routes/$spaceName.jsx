// app/routes/space.$spaceName.jsx

import { json, redirect } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { FaVideo, FaPen } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import TestimonialForm from "../components/TestimonialForm";

const API_URI = import.meta.env.VITE_API_URL;

export const handle = {
  skipLayout: true,
};

export async function loader({ request, params }) {
  const spaceId = params.spaceName;
  const cookieHeader = request.headers.get("Cookie");

  try {
    const response = await fetch(`${API_URI}/api/v1/users/spaces/getSpace/${spaceId}`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
    });

    if (!response.ok) {
      throw new Response("Failed to load space", {
        status: response.status,
      });
    }

    const data = await response.json();
    return json({ data });
  } catch (err) {
    throw new Response("Something went wrong", { status: 500 });
  }
}



export async function action({ request }) {
  const formData = await request.formData();

  const spaceId = formData.get("spaceId");
  const name = formData.get("name");
  const email = formData.get("email");
  const text = formData.get("text");
  const videoURL = formData.get("videoURL"); 
  const avatar = formData.get("avatar");
  const rating = formData.get("rating")

  console.log(videoURL)
  console.log(avatar)

  const cookieHeader = request.headers.get("Cookie");

  const hasText = text && text.trim() !== "";
  const hasVideo = videoURL && typeof videoURL === "object" && videoURL.size > 0;

  const hasAvatar = avatar && typeof avatar === "object" && avatar.size > 0;

  
  if (!hasText && !hasVideo) {
    return json(
      { message: "Please provide either a text or video testimonial.", status: 400 },
      { status: 400 }
    );
  }

  if (hasText && hasVideo) {
    return json(
      { message: "Please provide either text or video — not both.", status: 400 },
      { status: 400 }
    );
  }

  if ([name, email].some(field => !field?.trim())) {
    return json(
      { message: "Name and Email are required.", status: 400 },
      { status: 400 }
    );
  }

  // Prepare formData to send to your backend API
  const payload = new FormData();
  payload.append("name", name);
  payload.append("email", email);
  payload.append("rating" , rating)
  // payload.append("text", hasText ? text : "");
  // payload.append("spaceId", spaceId);


  if (hasText){
    payload.append("text" , text);
  }
  if (hasVideo) {
    payload.append("videoURL", videoURL); // must match backend multer field name
  }

  if (hasAvatar) {
    payload.append("avatar", avatar); // must match backend multer field name
  }

  console.log(payload)

  try {
    const response = await fetch(`${API_URI}/api/v1/users/Testimonial/create-Testimonial/${spaceId}`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        //  "Content-Type": "application/json",
        
      },
      credentials: "include",
      body: payload,
    });
/*
    if (!response.ok) {
      const errorRes = await response.json();
      return json({ message: errorRes.message || "Something went wrong", status: 400 }, { status: 400 });
    }
      */

    return redirect(`/${spaceId}`);
  } catch (err) {
    console.error("Error submitting testimonial:", err);
    return json({ message: "Server error", status: 500 });
  }
}



export default function SpacePublicPage() {
  const { data } = useLoaderData();
  const space = data.data;

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const[testimonialType , setTestimonialType] = useState(null);

  return (
    <section className="min-h-screen bg-white text-gray-900 p-6 flex items-center justify-center relative">
      <div className="absolute top-6 left-6 flex items-center space-x-1">
       
        <h1 className="text-2xl font-extrabold text-blue-600">TestimonialApp</h1>
      </div>

      <div className="max-w-xl w-full text-center space-y-6">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center"
        >
          <motion.img
            src={space.avatar}
            alt={space.name}
            className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-blue-600 shadow-lg "
          />
        </motion.div>

        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-1">{space.name}</h1>
          <p className="text-gray-600 text-sm md:text-base">{space.HeaderTitle}</p>
        </div>

        {/* Description */}
        {space.description && (
          <p className="text-gray-500 text-sm md:text-base px-2">{space.description}</p>
        )}

        {/* Questions */}
        <div className="text-left mt-6 space-y-4">
          <h2 className="text-[25px] font-extrabold text-gray-800">Questions</h2>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
            <li><strong>Who are you</strong> / what are you working on?</li>
            <li>How has <strong>[our product/service]</strong> helped you?</li>
            <li>What is the best thing about <strong>[our product/service]</strong>?</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <button
            onClick={() => {
              setTestimonialType("video")
              setShowForm(true)}}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2 w-full sm:w-auto"
          >
            <FaVideo size={16} />
            Record a Video
          </button>

          <button
            onClick={() => {
              setTestimonialType("text")
              setShowForm(true)}}
            className="bg-gray-700 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 flex items-center gap-2 w-full sm:w-auto"
          >
            <FaPen size={16} />
            Send a text
          </button>
        </div>

        {/* Testimonial Form */}
        {showForm && (
          <TestimonialForm
  space={space}
  rating={rating}
  setRating={setRating}
  onClose={() => setShowForm(false)}
  testimonialType={testimonialType} // "text" or "video"
/>

        )}
      </div>
    </section>
  );
}
