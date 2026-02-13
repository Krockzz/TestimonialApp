import fetch from "node-fetch";

export const extractYouTubeVideoId = (url) => {
  if (!url) return null;

  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(regex);
  return match ? match[1] : null;
};

export const fetchYouTubeVideoById = async (videoId) => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing YOUTUBE_API_KEY in environment variables.");
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/videos");

  url.searchParams.set("part", "snippet,contentDetails,status,statistics");
  url.searchParams.set("id", videoId);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), { method: "GET" });

  const data = await response.json();

  if (response.status === 403) {
    throw new Error(
      data?.error?.message ||
        "Forbidden: API key invalid, quota exceeded, or API not enabled."
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error?.message || "Failed to fetch video from YouTube API"
    );
  }

  if (!data.items || data.items.length === 0) {
    throw new Error("Video not found, private, or unavailable.");
  }

  const video = data.items[0];

  return {
    ...video,
    likeCount: Number(video.statistics?.likeCount || 0),
    viewCount: Number(video.statistics?.viewCount || 0),
    commentCount: Number(video.statistics?.commentCount || 0),
  };
};

export const parseISODurationToSeconds = (isoDuration) => {
  if (!isoDuration) return 0;

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  const hours = Number(match?.[1] || 0);
  const minutes = Number(match?.[2] || 0);
  const seconds = Number(match?.[3] || 0);

  return hours * 3600 + minutes * 60 + seconds;
};
