export const extractTweetId = (tweetUrl) => {
    const match = tweetUrl.match(/status\/(\d+)/);
    return match ? match[1] : null;

}
