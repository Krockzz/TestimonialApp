import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { json, redirect } from "@remix-run/node";
import SpacesList from "../components/SpaceList";
import { FaLayerGroup } from "react-icons/fa";
import { createCookie } from "@remix-run/node";

const API_URL = import.meta.env.VITE_API_URL;

// ---------------------------
// 1️⃣ Create cookies for access and refresh tokens
// ---------------------------
export const accessTokenCookie = createCookie("accessToken", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 60 * 60 * 24,
});

export const refreshTokenCookie = createCookie("refreshTokens", {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 60 * 60 * 24,
});

// ---------------------------
// 2️⃣ Loader
// ---------------------------
export async function loader({ request }) {
  const url = new URL(request.url);
  const accessToken = url.searchParams.get("accessToken");
  const refreshToken = url.searchParams.get("refreshTokens");

  // If user comes from OAuth redirect → set cookies and return minimal data
  if (accessToken && refreshToken) {
    const headers = new Headers();
    headers.append("Set-Cookie", await accessTokenCookie.serialize(accessToken));
    headers.append("Set-Cookie", await refreshTokenCookie.serialize(refreshToken));

    return json({ oauthRedirect: true }, { headers });
  }

  // If no OAuth tokens, just return minimal data
  return json({ oauthRedirect: false });
}

// ---------------------------
// 3️⃣ Component
// ---------------------------
export default function Spaces() {
  const loaderData = useLoaderData();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSpaces() {
      try {
        const res = await fetch(`${API_URL}/api/v1/users/spaces/getSpaces`, {
          credentials: "include", // send cookies
        });

        if (!res.ok) {
          if ([401, 403].includes(res.status)) {
            window.location.href = "/login"; // redirect if unauthorized
          }
          throw new Error("Failed to fetch spaces");
        }

        const data = await res.json();
        setSpaces(data.data.docs || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchSpaces();
  }, []);

  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-black via-gray-900 to-black min-h-screen space-y-14">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-[42px] md:text-5xl font-extrabold text-white tracking-tight">
          Overview
        </h1>
        <p className="text-gray-400 text-sm">
          A summary of your testimonial activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-blue-600 to-purple-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/90 rounded-3xl p-6 flex flex-col justify-center items-start backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-3">
              <FaLayerGroup className="text-white text-2xl" />
              <h2 className="text-lg font-semibold text-white">Total Spaces</h2>
            </div>
            <p className="text-4xl font-extrabold text-white">{spaces.length}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Spaces List Section */}
      {loading ? (
        <div className="text-white">Loading spaces...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <SpacesList spaces={spaces} />
      )}
    </div>
  );
}
