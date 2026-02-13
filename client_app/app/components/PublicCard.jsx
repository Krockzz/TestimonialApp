import { Play, Pause } from "lucide-react";
import { useRef, useState } from "react";
import dayjs from "dayjs";

export default function PublicCard({ testimonial }) {
  const {
    name,
    avatar,
    text,
    videoURL,
    rating,
    youtubeData,
    sourceType,
    createdAt,
  } = testimonial;

  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    videoRef.current.paused
      ? videoRef.current.play()
      : videoRef.current.pause();
    setPlaying(!videoRef.current.paused);
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Determine if video exists
  const isVideo = sourceType === "youtube" ? Boolean(youtubeData?.originalVideoUrl) : Boolean(videoURL);

  return (
    <div
      className="
        group relative overflow-hidden rounded-3xl border
        border-gray-200/60 bg-gradient-to-br from-white via-white to-gray-50
        shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800
      "
    >
      {isVideo && sourceType !== "youtube" && (
        // ---------- NORMAL VIDEO ----------
        <div className="relative h-[280px] w-full overflow-hidden rounded-3xl">
          <video
            ref={videoRef}
            src={videoURL}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            preload="metadata"
            onEnded={() => setPlaying(false)}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <button
            onClick={togglePlay}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="rounded-full bg-white/25 p-4 backdrop-blur-lg transition group-hover:scale-110">
              {playing ? (
                <Pause className="h-10 w-10 text-white" />
              ) : (
                <Play className="h-10 w-10 text-white" fill="white" />
              )}
            </div>
          </button>

          <div className="absolute bottom-0 left-0 right-0 z-20 p-5 text-white">
            <p className="font-semibold tracking-tight">{name}</p>
            <div className="mt-1 flex text-yellow-400 text-lg drop-shadow">
              {Array.from({ length: rating || 0 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
          </div>
        </div>
      )}

     {isVideo && sourceType === "youtube" && youtubeData && (
  <div className="relative h-[320px] w-full overflow-hidden rounded-3xl">
    <iframe
      className="absolute inset-0 h-full w-full rounded-3xl"
      src={`https://www.youtube.com/embed/${youtubeData.videoId}`}
      title={youtubeData.title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />

    {/* Overlay info */}
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 p-5 bg-gradient-to-t from-black/80 to-transparent text-white">
      <p className="font-semibold tracking-tight line-clamp-2">
        {youtubeData.title}
      </p>

      <p className="text-xs text-gray-300 mt-1">
        {youtubeData.channelName}
      </p>

      <div className="mt-1 flex text-yellow-400 text-lg drop-shadow">
        {Array.from({ length: rating || 0 }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>

      <div className="mt-1 text-xs text-gray-300">
        👍 {youtubeData.upvotes.toLocaleString()}
      </div>
    </div>
  </div>
)}

      {!isVideo && (
        // ================= TEXT CARD =================
        <div className="flex flex-col p-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-100 dark:ring-zinc-700"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-semibold">
                {name?.[0]?.toUpperCase()}
              </div>
            )}

            <p className="font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              {name}
            </p>
          </div>

          {/* Rating */}
          <div className="mt-3 flex text-yellow-400 text-lg drop-shadow-sm">
            {Array.from({ length: rating || 0 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>

          {/* Testimonial text */}
          <p className="mt-3 text-[17px] leading-relaxed text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
            “{text}”
          </p>

          {/* Footer */}
          <div className="mt-5 text-sm text-gray-500 dark:text-gray-400">
            {formattedDate}
          </div>
        </div>
      )}
    </div>
  );
}
