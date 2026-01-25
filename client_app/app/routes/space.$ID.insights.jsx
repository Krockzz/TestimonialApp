import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { ArrowLeft, Sparkles } from "lucide-react";

import { requireUser } from "../../../utilities/requireUser";

const API_URI = import.meta.env.VITE_API_URL;


export async function loader({ request, params }) {
  await requireUser(request); // auth guard
  const spaceId = params.ID;

  if (!spaceId) {
    throw new Response("Space ID not found", { status: 400 });
  }

  const cookieHeader = request.headers.get("Cookie");

  const response = await fetch(
    `${API_URI}/api/v1/users/spaces/get-Insights/${spaceId}`,
    {
      method: "GET",
      headers: {
        Cookie: cookieHeader
      }
    }
  );

  if (!response.ok) {
    throw new Response("Failed to fetch space insights", { status: 500 });
  }

  const data = await response.json();
  const spaceInsights = data?.data || {};

  return json({ spaceInsights });
}

/* ---------------- PAGE ---------------- */

export default function Insights() {
  const navigate = useNavigate();
  const navigation = useNavigation();
const isLoading = navigation.state === "loading";
  const { spaceInsights } = useLoaderData();

  const { strengths, improvements, lastGeneratedAt } = spaceInsights;

  const formattedDate = lastGeneratedAt
    ? new Date(lastGeneratedAt).toLocaleString()
    : "N/A";

  // Break long text into readable bullet points
  const splitPoints = (text) =>
    text
      ?.split(".")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 6);

  const strengthPoints = splitPoints(strengths);
  const improvementPoints = splitPoints(improvements);

  
    if (isLoading) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-center animate-pulse">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Generating Space Insights...
      </h2>
      <p className="text-gray-400 mb-8">
        Analyzing testimonials and extracting key strengths & improvements.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-40 rounded-2xl bg-white/10" />
        <div className="h-40 rounded-2xl bg-white/10" />
      </div>
    </div>
  );
} 

return (
    <div className="min-h-screen text-white bg-gradient-to-br from-black via-slate-950 to-black">
      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-3"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-400" size={22} />
            <h1 className="text-2xl font-semibold">Space Insights</h1>
          </div>

          <p className="text-sm text-gray-400 mt-1">
            AI-powered feedback intelligence for your business
          </p>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard
            label="Strength Signals"
            value={strengthPoints?.length || 0}
          />
          <StatCard
            label="Improvement Signals"
            value={improvementPoints?.length || 0}
          />
          <StatCard
            label="Last Updated"
            value={formattedDate}
            small
          />
        </div>

        {/* Insights */}
        <div className="space-y-6">
          <InsightCard
            title="Strengths"
            icon="💪"
            points={strengthPoints}
            accent="from-green-500/20 to-transparent"
          />

          <InsightCard
            title="Customer Concerns"
            icon="⚠️"
            points={improvementPoints}
            accent="from-orange-500/20 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ label, value, small }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`mt-1 font-semibold ${small ? "text-sm" : "text-xl"}`}>
        {value}
      </p>
    </div>
  );
}

function InsightCard({ title, icon, points, accent }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 overflow-hidden">
      {/* Accent glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${accent} opacity-40 pointer-events-none`}
      />

      <div className="relative">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <span>{icon}</span>
          {title}
        </h2>

        <ul className="space-y-2 text-sm text-gray-200">
          {points?.length ? (
            points.map((point, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-purple-400">•</span>
                <span>{point}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">
              No insights available yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
