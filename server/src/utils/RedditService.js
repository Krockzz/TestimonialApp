import fetch from "node-fetch";

function toRedditJsonUrl(redditUrl) {
  if (!redditUrl.includes("reddit.com")) {
    throw new Error("Invalid Reddit URL");
  }

  const cleanUrl = redditUrl.split("?")[0].replace(/\/$/, "");

  return `${cleanUrl}.json`;
}

export const fetchRedditPostByUrl = async (redditUrl) => {
  const url = toRedditJsonUrl(redditUrl);

  const response = await fetch(url, {
    method: "GET",
    headers: {
 
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept": "application/json",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://www.reddit.com/",
      "DNT": "1",
      "Connection": "keep-alive",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
    },
  });

  if (response.status === 429) {
    throw new Error("Rate limit exceeded by Reddit. Please try again later.");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch reddit post (${response.status}) and the error message is ${response.statusText} for the url ${url}`);
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
