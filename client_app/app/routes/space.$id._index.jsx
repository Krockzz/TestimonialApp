import { json, useLoaderData, redirect } from "@remix-run/react";
import { requireUser } from "../../../utilities/requireUser";
import CollectingWidgetModal from "../components/CollectingWidgetModal";
import { GiSelfLove } from "react-icons/gi";
import { CiInboxIn  } from "react-icons/ci";
import WallOfLovePanel from "../components/WallOfLOvePanel";
import { IoArrowRedoCircleSharp } from "react-icons/io5";
import RequestTestimonial from "../components/RequestTestimonial";


import {
  Pencil,
  Inbox,
  ChevronRight,
  ChevronDown,
  Youtube,
  Twitter,
  Instagram,
  Layers,
  Globe,
  BarChart3,
} from "lucide-react";
import { RiSpamFill } from "react-icons/ri";
import { FaEnvelopeOpenText } from "react-icons/fa";

import TestimonialCard from "../components/TestimonialCard";
import Integration from "../components/Integration";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineAnalytics } from "react-icons/md";

const API_URI = import.meta.env.VITE_API_URL;

export async function loader({ request, params }) {
  await requireUser(request);
  const spaceId = params.id;
  const cookieHeader = request.headers.get("Cookie");

  const res1 = await fetch(
    `${API_URI}/api/v1/users/spaces/getSpace/${spaceId}`,
    { headers: { Cookie: cookieHeader } }
  );

  const res2 = await fetch(
    `${API_URI}/api/v1/users/Testimonial/getTestimonials/${spaceId}`,
    { headers: { Cookie: cookieHeader } }
  );

  if (!res1.ok || !res2.ok) {
    throw new Response("Failed to load data", { status: 500 });
  }

  const spaceData = await res1.json();
  const testimonialData = await res2.json();

  const docs = testimonialData.data.docs;

  return json({
  spaceData,
  customerTestimonials: docs.filter(
    t => t.sourceType !== "twitter" && t.sourceType !== "reddit"
  ),
  twitterTestimonials: docs.filter(
    t => t.sourceType === "twitter" || t.sourceType === "reddit"
  ),
});

}


export async function action({ request, params }) {
  const cookieHeader = request.headers.get("Cookie");
  const data = await request.formData();
  const spaceId = params.id;

  if (data.get("intent") === "importTweet" || data.get("intent") === "importReddit") {

    if(data.get("intent") === "importTweet"){
    const tweetUrl = data.get("twitterUrl");

    await fetch(
      `${API_URI}/api/v1/users/Testimonial/import-twitter/${spaceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify({ tweetUrl, spaceId }),
      }
    );

    return redirect(`/space/${spaceId}`);
  }

  else {
    const redUrl = data.get("redditUrl");
    console.log("So the reddit URL is" , redUrl);

    await fetch(
      `${API_URI}/api/v1/users/Testimonial/import-reddit/${spaceId}`, {
        method : "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify({ redUrl, spaceId }),  
        }
      
    );

    return redirect(`/space/${spaceId}`);

  }
}

  const testimonialId = data.get("testimonialId");

  await fetch(
    `${API_URI}/api/v1/users/Testimonial/delete/${testimonialId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({ testimonialId, spaceId }),
    }
  );

  return redirect(`/space/${spaceId}`);
}

export default function TestimonialsOnly() {
  const { spaceData, customerTestimonials, twitterTestimonials } =
    useLoaderData();

  const space = spaceData.data;

  const [filter, setFilter] = useState("All");
  const [activePanel, setActivePanel] = useState("testimonials");

  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [showPages, setShowPages] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const [showWidgetModal, setShowWidgetModal] = useState(false);

  const filteredTestimonials = customerTestimonials.filter(t => {
    if (filter === "Spam") return t.status === "spam";
    if (t.status === "spam") return false;

    if (filter === "All") return true;
    if (filter === "Text") return !t.videoURL;
    if (filter === "Videos") return !!t.videoURL;

    return true;
  });

  const filters = [
    { label: "All", icon: Inbox },
    { label: "Videos", icon: FaEnvelopeOpenText },
    { label: "Text", icon: Pencil },
    { label: "Spam", icon: RiSpamFill },
  ];

  return (
    <section className="min-h-screen bg-gray-950 text-white py-8">
      <hr className="border-t border-gray-700 mb-6" />

      {/* Header */}
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

      {/* MAIN LAYOUT */}
      {/* 🔥 FIX: items-start so height grows naturally */}
      <div className="flex items-start gap-6 px-6">
        {/* Sidebar */}
        <aside className="w-56 shrink-0">
          <h2 className="font-bold text-xl mb-4">Inbox</h2>

          {filters.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setFilter(label);
                setActivePanel("testimonials");
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left
                ${
                  filter === label
                    ? "text-white border-b-2 border-blue-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
            >
              <Icon className="w-4 h-4" />
              {label === "All" ? "All Testimonials" : label}
            </button>
          ))}

          <Accordion
            title="Integrations"
            open={showIntegrations}
            toggle={setShowIntegrations}
            items={[
              ["Social Media", "integration", [Twitter, Instagram]],
              ["Video", "integration-video", [Youtube]],
            ]}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          />

          <Accordion
            title="Embed"
            icon={Layers}
            open={showEmbed}
            toggle={setShowEmbed}
            items={[
              ["Collecting widget", "embed-widget", [CiInboxIn]],
              ["Wall of Love", "wall-of-love", [GiSelfLove]],
            ]}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            onSelect={key => {
              if (key === "embed-widget") setShowWidgetModal(true);
            }}
          />

          <Accordion
            title="Pages"
            icon={Globe}
            open={showPages}
            toggle={setShowPages}
            items={[
              ["Public Page", "public-page", [GiSelfLove]],
              ["Request Testimonial", "req-testi", [IoArrowRedoCircleSharp]],
            ]}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          />

          <Accordion
            title="Analytics"
            icon={BarChart3}
            open={showAnalytics}
            toggle={setShowAnalytics}
            items={[
              ["Metrics", "analytics-overview" , [MdOutlineAnalytics]],
            ]}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          />
        </aside>


        <div className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel + filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 w-full h-auto"
            >
              {activePanel === "integration" && (
                <Integration
                  twitterTestimonials={twitterTestimonials}
                  spaceId={space._id}
                />
              )}

              {activePanel === "public-page" && (
                <WallOfLovePanel spaceId={space._id} />
              )}

              {activePanel === "req-testi" && (
                <RequestTestimonial spaceId={space._id} />
              )}

              {activePanel === "testimonials" &&
                filteredTestimonials.map(t => (
                  <TestimonialCard
                    key={t._id}
                    testimonial={t}
                    spaceId={space._id}
                    avatar={space.avatar}
                    type={t.videoURL ? "video" : "text"}
                  />
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <CollectingWidgetModal
        open={showWidgetModal}
        onClose={() => setShowWidgetModal(false)}
        spaceName={space.name}
        spaceAvatar={space.avatar}
        spaceId={space._id}
      />
    </section>
  );
}

/* ---------------- Accordion ---------------- */

function Accordion({
  title,
  icon: Icon,
  open,
  toggle,
  items,
  activePanel,
  setActivePanel,
  onSelect,
}) {
  return (
    <div className="mt-6">
      <button
        onClick={() => toggle(v => !v)}
        className="w-full flex justify-between px-3 py-2 hover:bg-gray-800 rounded-md"
      >
        <span className="flex items-center gap-2 text-[15px] font-medium">
          {Icon && <Icon className="w-4 h-4" />}
          {title}
        </span>
        {open ? <ChevronDown /> : <ChevronRight />}
      </button>

      {open && (
        <div className="ml-4 mt-2 flex flex-col gap-2">
          {items.map(([label, key, icons]) => (
            <button
              key={key}
              onClick={() => {
                setActivePanel(key);
                onSelect?.(key);
              }}
              className={`flex items-center gap-2 px-2 py-1 text-left rounded hover:bg-gray-800 ${
                activePanel === key
                  ? "bg-gray-800 border-l-4 border-blue-400"
                  : "text-gray-300"
              }`}
            >
              {icons &&
                icons.map((I, i) => <I key={i} className="w-4 h-4" />)}
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

