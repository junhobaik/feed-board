export const ADD_FEED = 'ADD_FEED';
export const LOAD_ITEMS = 'LOAD_ITEMS';
export const TOGGLE_VISIBLE_ITEMS = 'TOGGLE_VISIBLE_ITEMS';

export function addFeed(feedUrl, feed) {
  return {
    type: ADD_FEED,
    feedUrl,
    feed,
  };
}

export function loadItems(feedKey, feedItems) {
  return {
    type: LOAD_ITEMS,
    feedKey,
    feedItems,
  };
}

export function toggleVisibleItems(feedUrl) {
  return {
    type: TOGGLE_VISIBLE_ITEMS,
    feedUrl,
  };
}
