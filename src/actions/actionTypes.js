export const ADD_FEED = 'ADD_FEED';
export const LOAD_ITEMS = 'LOAD_ITEMS';
export const TOGGLE_VISIBLE_ITEMS = 'TOGGLE_VISIBLE_ITEMS';
export const REMOVE_FEED = 'REMOVE_FEED';
export const MODIFY_TITLE = 'MODIFY_TITLE';

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

export function toggleVisibleItems(feedLink) {
  return {
    type: TOGGLE_VISIBLE_ITEMS,
    feedLink,
  };
}

export function removeFeed(feedLink) {
  return {
    type: REMOVE_FEED,
    feedLink,
  };
}

export function modifyTitle(feedLink, feedTitle) {
  return {
    type: MODIFY_TITLE,
    feedLink,
    feedTitle,
  };
}
