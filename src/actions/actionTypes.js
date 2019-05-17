export const ADD_FEED = 'ADD_FEED';

export function addFeed(feedUrl, feed) {
  return {
    type: ADD_FEED,
    feedUrl,
    feed,
  };
}
