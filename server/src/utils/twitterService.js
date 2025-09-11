import fetch from "node-fetch";

export const fetchTweetById = async (tweetId) => {
  const url = `https://api.twitter.com/2/tweets/${tweetId}?expansions=author_id&tweet.fields=created_at,public_metrics&user.fields=name,username,profile_image_url`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  });

  const data = await response.json();

  if (response.status === 401) {
    throw new Error("Unauthorized: Invalid Bearer Token or insufficient permissions.");
  }

  if (!response.ok) {
    throw new Error(data?.detail || "Failed to fetch tweet from Twitter API");
  }

  return data;
};
