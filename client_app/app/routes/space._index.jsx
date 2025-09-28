import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FaLayerGroup } from "react-icons/fa";
import SpacesList from "../components/SpaceList";

// Loader for /space route
export async function loader({ request }) {
  const url = new URL(request.url);

  // ✅ OAuth flow: check if redirected from Google login
  const isOAuth = url.searchParams.get("oauth") === "true";
  const accessToken = url.searchParams.get("accessToken");

  // If OAuth, redirect to clean URL but pass token via loader
  if (isOAuth && accessToken) {
    // Redirect to /space without query params
    return redirect("/space", {
      headers: {
        // You can pass a custom header or session if needed here
      },
    });
  }

  // ---------------------------
  // Normal loader flow: fetch spaces
  // ---------------------------
  // First, get token from query param (first request after OAuth) or later from somewhere else
  let token = accessToken;
  console.log(token)

  // You could also store token in a session or secure cookie for future requests
  if (!token) {
    // Example: no token provided → redirect to login
    return redirect("/login");
  }

  // Fetch spaces using Authorization header
  const res = await fetch(`${process.env.VITE_API_URL}/api/v1/users/spaces/getSpaces`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if ([401, 403].includes(res.status)) {
    return redirect("/login");
  }

  const data = await res.json();
  return json({ spaces: data.data.docs || [], accessToken: token });
}

export default function Spaces() {
  const loaderData = useLoaderData();
  const token = loaderData.accessToken;

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
            <p className="text-4xl font-extrabold text-white">
              {loaderData.spaces.length}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10" />
      <SpacesList spaces={loaderData.spaces} />
    </div>
  );
}
