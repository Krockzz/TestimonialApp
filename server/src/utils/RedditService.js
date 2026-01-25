import fetch from "node-fetch";

function toRedditJsonUrl(redditUrl) {
  if (!redditUrl.includes("reddit.com")) {
    throw new Error("Invalid Reddit URL");
  }

  // Remove query params
  const cleanUrl = redditUrl.split("?")[0].replace(/\/$/, "");

  return `${cleanUrl}.json`;
}

export const fetchRedditPostByUrl = async (redditUrl) => {
  const url = toRedditJsonUrl(redditUrl);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      // Important: Reddit blocks requests without user-agent sometimes
      "User-Agent": "TestimonialApp/1.0 by krunal",
    },
  });

  if (response.status === 429) {
    throw new Error("Rate limit exceeded by Reddit. Please try again later.");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch reddit post (${response.status})`);
  }

  const data = await response.json();

  const post = data?.[0]?.data?.children?.[0]?.data;

  if (!post) {
    throw new Error("Invalid Reddit response format or post not found.");
  }

  return {
    postId: post.id,
    title: post.title,
    text: post.selftext,
    author: post.author,
    upvotes: post.ups,
    commentsCount: post.num_comments,
    permalink: `https://reddit.com${post.permalink}`,
    createdAt: new Date(post.created_utc * 1000),
    thumbnail: post.thumbnail,
    subreddit: post.subreddit,
  };
};
