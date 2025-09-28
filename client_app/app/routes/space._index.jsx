import { useEffect, useState } from "react";
import SpacesList from "../components/SpaceList";
import { FaLayerGroup } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function Spaces() {
  const [spaces, setSpaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshTokens = params.get("refreshTokens");

    if (accessToken && refreshTokens) {
     
      document.cookie = `accessToken=${accessToken}; path=/; max-age=${15 * 60}; secure; samesite=lax`;
      document.cookie = `refreshToken=${refreshTokens}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=lax`;

      // 3️⃣ Clean URL to remove tokens
      window.history.replaceState({}, "", "/space");
    }

    // 4️⃣ Fetch spaces from backend
    const fetchSpaces = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users/spaces/getSpaces`, {
          method: "GET",
          credentials: "include", // sends cookies automatically
        });

        if ([401, 403].includes(res.status)) {
          window.location.href = "/login";
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch spaces");

        const data = await res.json();
        setSpaces(data.data.docs || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  if (loading) return <div className="text-white p-4">Loading spaces...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

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
      <SpacesList spaces={spaces} />
    </div>
  );
}
