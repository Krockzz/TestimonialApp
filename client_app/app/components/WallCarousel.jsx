import { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";


export default function WallCarousel({
  testimonials = [],
  theme = "light",
  cardSize = "medium",
  mode = "manual",
  spaceDetails
}) {
  const [index, setIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isDark = theme === "dark";
  const containerRef = useRef(null);
  const isHovered = useRef(false);

  


  const visibleCountMap = {
    small: 3,
    medium: 2,
    large: 1
  };

  const visibleCount = visibleCountMap[cardSize];

const widthMap = {
  small: "calc((100% - 2rem * 2) / 3)", 
  medium: "calc((100% - 2rem) / 2)",     
  large: "100%"                         
};

  const heightMap = {
    small: "200px",
    medium: "240px",
    large: "320px"
  };

  const loopedTestimonials = [...testimonials, ...testimonials];

const next = () => {
  setIndex((prev) => prev + 1);
};

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? testimonials.length - visibleCount : prev - 1
    );
  };

  useEffect(() => {
  if (index >= testimonials.length) {
    setTimeout(() => {
      setIsTransitioning(false);
      setIndex(0);
    }, 500);
  } else {
    setIsTransitioning(true);
  }
}, [index, testimonials.length]);


  useEffect(() => {
    if (mode !== "auto") return;

    const interval = setInterval(() => {
      if (!isHovered.current && !isPaused) {
        next();
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [mode, testimonials.length]);

  useEffect(() => {
  const container = containerRef.current;
  if (!container) return;

  const firstChild = container.children[0];
  if (!firstChild) return;

  const gap = 32; 

  const cardWidth = firstChild.offsetWidth;

  const totalMove = index * (cardWidth + gap);

  setTranslateX(totalMove);
}, [index, cardSize]);

  return (
    <div
       className="flex flex-col items-center gap-8 w-full"
       onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={() => (isHovered.current = false && setIsPaused(false))}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
    >
    
      <div className="overflow-hidden w-full max-w-6xl mx-auto">
        <div
          ref={containerRef}
          className="flex gap-8 transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${translateX}px)`,
             transition: isTransitioning
      ? "transform 0.5s ease-in-out"
      : "none"
          }}
        >
          {loopedTestimonials.map((t) => {
            const isVideo = Boolean(t.videoURL);

            return (
              <div
                key={t._id}
                className="flex-shrink-0"
                style={{
                  width: widthMap[cardSize]
                }}
              >
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    height: isVideo ? heightMap[cardSize] : "240px",
                    background: isDark ? "#111827" : "#ffffff",
                    color: isDark ? "#ffffff" : "#000000",
                    border: isDark
                      ? "1px solid #374151"
                      : "1px solid #e5e7eb",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
                  }}
                >
                  {isVideo ? (
                    <>
                      {/* Background */}
                      <video
                        src={t.videoURL}
                        className="absolute inset-0 w-full h-full object-cover scale-110 opacity-30"
                        muted
                        playsInline
                      />

                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

                      {/* Main video */}
                      <video
                        src={t.videoURL}
                        className="relative w-full h-full object-contain z-20"
                        controls
                      />

                      {/* Content */}
                      <div className="absolute inset-0 p-4 flex flex-col justify-between z-30 pointer-events-none">
                        <div className="flex items-center gap-3">
                          <img
                            src={t.avatar || spaceDetails?.avatar}
                            className="w-9 h-9 rounded-full border-2 border-white shadow"
                          />
                          <span className="text-sm font-semibold text-white">
                            {t.name}
                          </span>
                        </div>

                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              size={14}
                              className={
                                i < t.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-5 h-full flex flex-col justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar || spaceDetails?.avatar}
                          className="w-11 h-11 rounded-full object-cover shadow"
                        />
                        <p className="font-semibold text-base">
                          {t.name}
                        </p>
                      </div>

                      <p className="text-sm opacity-80 leading-relaxed line-clamp-4">
                        “{t.text}”
                      </p>

                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              size={14}
                              className={
                                i < t.rating
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }
                            />
                          ))}
                        </div>

                        {t.createdAt && (
                          <p className="text-xs opacity-50">
                            {new Date(t.createdAt).toDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {mode === "manual" && testimonials.length > visibleCount && (
        <div className="flex gap-4 mt-2">
          <button
            onClick={prev}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-300 transition hover:text-black"
          >
            ←
          </button>

          <button
            onClick={next}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black hover:bg-gray-300 transition hover:text-black"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}