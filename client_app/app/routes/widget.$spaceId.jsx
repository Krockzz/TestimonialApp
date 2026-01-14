import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { FaVideo, FaPen } from "react-icons/fa";

const API_URI = import.meta.env.VITE_API_URL;

export const handle = {
  skipLayout: true,
};

export const loader = async ({ request, params }) => {
  const spaceId = params.spaceId;
  const cookieHeader = request.headers.get("Cookie");

  if (!spaceId) {
    throw new Response("Invalid space ID", { status: 400 });
  }

  try {
    const res = await fetch(
      `${API_URI}/api/v1/users/spaces/getSpace/${spaceId}`,
      {
        method: "GET",
        headers: { Cookie: cookieHeader },
      }
    );

    const result = await res.json();
    const space_Data = result.data;

    return json({ space_Data });
  } catch (err) {
    console.error("Widget load failed:", err);
    throw new Response("Failed to load widget", { status: 500 });
  }
};

export default function CollectingWidgetPage() {
  const { space_Data } = useLoaderData();
  console.log("Space Data:", space_Data);

  const [searchParams] = useSearchParams();

  const theme = searchParams.get("theme") || "light";
  const isDark = theme === "dark";

 
  const targetUrl = `/${space_Data._id}?theme=${theme}`;

  return (
    <div
      className={`w-screen h-screen flex items-center justify-center ${
        isDark ? "bg-neutral-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`w-full h-full max-w-xl flex flex-col justify-between p-6 ${
          isDark ? "bg-neutral-900" : "bg-white"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <img
            src={
              space_Data?.avatar ||
              "https://api.dicebear.com/7.x/shapes/svg?seed=space"
            }
            alt="space"
            className="w-14 h-14 rounded-full border object-cover"
          />
          <div>
            <p className="font-semibold text-base">
              {space_Data?.name || "Space"}
            </p>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Share your experience
            </p>
          </div>
        </div>

        {/* QUESTIONS */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Questions</h3>
          <ul
            className={`list-disc pl-5 space-y-1 text-sm ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <li>Who are you and what do you do?</li>
            <li>How has our product helped you?</li>
            <li>What would you tell others about us?</li>
          </ul>
        </div>

        {/* ACTION BOX */}
        <div
          className={`mt-8 rounded-xl p-6 border text-center ${
            isDark
              ? "bg-neutral-800 border-white/10"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <p className="font-medium mb-6">
            Share your thoughts without any concern
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
         
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              <FaVideo /> Record a Video
            </a>

         
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold ${
                isDark
                  ? "bg-neutral-700 hover:bg-neutral-600"
                  : "bg-gray-800 hover:bg-gray-900"
              } text-white`}
            >
              <FaPen /> Send a Text
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className={`text-center text-xs mt-6 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          Powered by TestimonialApp
        </div>
      </div>
    </div>
  );
}
