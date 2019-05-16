export const ADD_FEED = 'ADD_FEED';

export function addFeed(title, rssUrl, siteUrl) {
  return {
    type: ADD_FEED,
    title,
    rssUrl,
    siteUrl
  };
}
