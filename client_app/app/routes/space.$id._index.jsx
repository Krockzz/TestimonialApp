import { json, useLoaderData, redirect } from "@remix-run/react";
import { requireUser } from "../../../utilities/requireUser";

import {
  Pencil,
  Inbox,
  ChevronRight,
  ChevronDown,
  Youtube,
  Twitter,
  Instagram,
} from "lucide-react";
import { FaEnvelopeOpenText } from "react-icons/fa";
import TestimonialCard from "../components/TestimonialCard";
import Integration from "../components/Integration";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const API_URI = import.meta.env.VITE_API_URL;

export async function loader({ request, params }) {
  const user = await requireUser(request);
  const spaceId = params.id;
  const cookieHeader = request.headers.get("Cookie");

  const res1 = await fetch(`${API_URI}/api/v1/users/spaces/getSpace/${spaceId}`, {
    method: "GET",
    headers: { Cookie: cookieHeader },
  });

  if (!res1.ok) throw new Response("Failed to load space", { status: res1.status });

  const res2 = await fetch(`${API_URI}/api/v1/users/Testimonial/getTestimonials/${spaceId}`, {
    method: "GET",
    headers: { Cookie: cookieHeader },
  });

  if (!res2.ok) throw new Response("Failed to load testimonials", { status: res2.status });

  const spaceData = await res1.json();
  const TestimonialData = await res2.json();

  return json({ spaceData, TestimonialData });
}

export async function action({ request, params }) {
  const cookieHeader = request.headers.get("Cookie");
  const data = await request.formData();
  const spaceId = params.id;
  const TestiId = data.get("testimonialId");

  if (!TestiId) {
    return json({ message: "No testimonial ID provided", status: 400 });
  }

  try {
    const res = await fetch(`${API_URI}/api/v1/users/Testimonial/delete/${TestiId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader,
      },
      body: JSON.stringify({ TestiId, spaceId }),
    });

    if (!res.ok) {
      return json({ message: "Failed to delete testimonial", status: res.status });
    }

    return redirect(`/space/${spaceId}`);
  } catch (err) {
    console.error("Error deleting testimonial:", err);
    return json({ message: "Internal server error", status: 500 });
  }
}

export default function TestimonialsOnly() {
  const { spaceData, TestimonialData } = useLoaderData();
  const space = spaceData.data;
  const testimonials = TestimonialData.data.docs;

  const [filter, setFilter] = useState("All");
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [activePanel, setActivePanel] = useState("testimonials"); 


  const filteredTestimonials = testimonials.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Text") return !t.videoURL;
    if (filter === "Videos") return !!t.videoURL;
    return true;
  });

  const filters = [
    { label: "All", icon: Inbox },
    { label: "Videos", icon: FaEnvelopeOpenText },
    { label: "Text", icon: Pencil },
  ];

  return (
    <section className="min-h-screen bg-gray-950 text-white py-8">
      <hr className="border-t border-gray-700 mb-6" />

      <div className="w-full flex items-center justify-between px-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src={space.avatar || "/default-avatar.png"}
            alt="Space Avatar"
            className="w-24 h-24 object-cover rounded-md"
          />
          <h1 className="text-xl font-semibold">{space.name}</h1>
        </div>

        <button className="bg-white hover:bg-gray-300 text-gray-600 px-4 py-2 rounded-md border border-gray-600 transition flex items-center gap-2">
          <Pencil className="w-4 h-4" />
          Edit Space
        </button>
      </div>

      <hr className="border-t border-gray-700 mb-6" />

      <div className="w-full flex gap-6 px-6">
        <aside className="w-48">
          <div className="flex flex-col gap-2 text-sm">
            <h2 className="text-white font-bold mb-4 text-xl">Inbox</h2>

            {filters.map(({ label, icon:Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setFilter(label);
                   setActivePanel("testimonials");

                }
                  
                }
                
                className={`w-full flex items-center gap-2 text-left px-3 py-2 transition text-[15px]
                  ${
                    filter === label
                      ? "text-white border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label === "All" ? "All Testimonials" : label}
              </button>
            ))}

            <div className="mt-8">
              <button
                type="button"
                onClick={() => setShowIntegrations((prev) => !prev)}
                className="w-full text-left flex items-center justify-between text-white px-3 py-2 hover:bg-gray-800 transition rounded-md"
              >
                <span className="text-[15px] font-medium">Integrations</span>
                {showIntegrations ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {showIntegrations && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                 <button
  type="button"
  onClick={() => setActivePanel("integration")}
  className={`flex items-center gap-2 text-gray-300 px-2 py-1 rounded hover:bg-gray-800 w-full text-left ${
    activePanel === "integration" ? "bg-gray-800 border-l-4 border-blue-400" : ""
  }`}
>
  Social Media
  <Twitter className="w-4 h-4" />
  <Instagram className="w-4 h-4" />
</button>



                  <div className="flex items-center gap-2 text-gray-300 px-2 py-1 rounded hover:bg-gray-800">
                    Video <Youtube className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-h-[300px] flex items-start justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full flex flex-col gap-4"
            >
              {activePanel === "integration" ? (
  <Integration />
) : filteredTestimonials.length === 0 ? (
  <div className="flex flex-col items-center gap-4 py-10">
    <Inbox className="w-14 h-14 text-gray-500 mb-4" />
    <p className="text-lg font-semibold text-center text-2xl text-white">
      No testimonials yet
    </p>
  </div>
) : (
  filteredTestimonials.map((t) => {
    const type = t.videoURL ? "video" : "text";
    return (
      <TestimonialCard
        key={t._id}
        testimonial={t}
        avatar={space.avatar}
        spaceId={space._id}
        type={type}
      />
    );
  })
)}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
