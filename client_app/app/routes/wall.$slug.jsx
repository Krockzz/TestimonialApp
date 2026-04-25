import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import PublicCard from "../components/PublicCard";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const API_URI = import.meta.env.VITE_API_URL;

export const handle = { skipLayout: true };

export async function loader({ request, params }) {
  const spaceId = params.slug;
  const cookieHeader = request.headers.get("Cookie");

  let response;

  try {
    response = await fetch(`${API_URI}/api/v1/users/Testimonial/getTestimonials/${spaceId}`, {
      method: "GET",
      headers: { Cookie: cookieHeader },
    });
  } catch (error) {
    console.log("Error fetching testimonials:", error);
    throw new Response("Failed to load testimonials", { status: 500 });
  }

  const data = await response.json();
  const result = data.data.docs;

  const featuredTestimonials = result.filter(t => t.featured?.enabled === true);

  let response2;
  try{
     response2 = await fetch(`${API_URI}/api/v1/users/spaces/getSpace/${spaceId}`, {
      method: "GET",
      headers: { Cookie: cookieHeader },
    }); 

  }
  catch(error){
    console.log("Error fetching space details:", error);
    throw new Response("Failed to load space details", { status: 500 });

  }

  const data2 = await response2.json();
  console.log("Space Details:", data2);

  const spaceDetails = data2.data;

  return json({ featuredTestimonials, spaceId , spaceDetails });
}

export default function Wall() {
  const { featuredTestimonials, spaceId, spaceDetails } = useLoaderData();
  const navigate = useNavigate();

  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("wall-theme");
    if (saved === "dark") setDark(true);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("wall-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("wall-theme", "light");
    }
  }, [dark]);

  return (
    <div className="relative min-h-screen bg-gray-200 transition-colors duration-300 dark:bg-zinc-950">

      {/* Top-left Brand */}
      <div className="absolute top-6 left-6 z-20">
        <h1 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
          TestimonialApp
        </h1>
      </div>

      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setDark((p) => !p)}
          className="flex items-center justify-center rounded-full border bg-white p-2 shadow-md transition hover:scale-105 dark:border-zinc-700 dark:bg-zinc-800"
        >
          {dark ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-zinc-700" />
          )}
        </button>
      </div>

    
      <section className="relative px-6 pt-20 md:pt-28">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border bg-white shadow-lg transition-colors dark:border-zinc-800 dark:bg-zinc-900">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Wall of Love"
            className="h-[300px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              {`Wall of Trust of ${spaceDetails?.name || "Unknown Space"}`}
            </h2>
            <p className="mb-6 max-w-xl text-sm text-gray-200">
              See what people are saying about us. Real feedback from real users.
            </p>

            <button
              onClick={() => {
                setTimeout(() => {
                  navigate(`/${spaceId}`);
                }, 500);
              }}
              className="rounded-xl bg-indigo-600 px-7 py-3 text-base font-semibold text-white shadow-md transition hover:bg-indigo-700 active:scale-95"
            >
              Submit your testimonial
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL GRID */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-16">
        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
          {featuredTestimonials.map((t) => (
            <div key={t._id} className="mb-8 break-inside-avoid">
              <PublicCard testimonial={t} />
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t transition-colors dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Powered by <span className="font-medium text-gray-700 dark:text-gray-300">Testimonia</span>
        </div>
      </footer>
    </div>
  );
}

