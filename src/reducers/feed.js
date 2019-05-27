/* eslint-disable no-shadow */
import _ from 'lodash';

const storageData = JSON.parse(localStorage.getItem('feed'));

const initialState = storageData || {
  feed: {},
};

function addFeed(state, feedUrl, feedData) {
  const { feed } = state;
  const feedName = feed[_.snakeCase(feedData.link)] || undefined;

  if (feedName) {
    return state;
  }

  return {
    feed: {
      ...feed,
      [_.snakeCase(feedData.link)]: {
        ...feedData,
        feedUrl: feedData.feedUrl || feedUrl,
        lastLoadDate: new Date(),
        showItems: true,
      },
    },
  };
}

function loadItems(state, feedKey, feedItems) {
  const originFeed = state.feed;

  if (feedKey) {
    return {
      feed: {
        ...originFeed,
        [feedKey]: {
          ...originFeed[feedKey],
          items: feedItems,
          lastLoadDate: new Date(),
        },
      },
    };
  }
  return state;
}

function toggleVisibleItems(state, feedLink) {
  const { feed } = state;
  const feedKey = _.snakeCase(feedLink);
  const originFeed = feed[feedKey];

  return {
    feed: {
      ...feed,
      [feedKey]: {
        ...originFeed,
        showItems: !originFeed.showItems,
      },
    },
  };
}

function removeFeed(state, feedUrl) {
  const { feed } = state;

  const feedKey = _.snakeCase(feedUrl);

  delete feed[feedKey];

  return {
    ...state,
    feed: {
      ...feed,
    },
  };
}

function modifyTitle(state, feedUrl, feedTitle) {
  const { feed } = state;

  const feedKey = _.snakeCase(feedUrl);
  const originFeed = feed[feedKey];

  return {
    feed: {
      ...feed,
      [feedKey]: {
        ...originFeed,
        title: feedTitle
      },
    },
  };
}

export default function feed(state = initialState, action) {
  switch (action.type) {
    case 'ADD_FEED':
      return addFeed(state, action.feedUrl, action.feed);
    case 'LOAD_ITEMS':
      return loadItems(state, action.feedKey, action.feedItems);
    case 'TOGGLE_VISIBLE_ITEMS':
      return toggleVisibleItems(state, action.feedUrl);
    case 'REMOVE_FEED':
      return removeFeed(state, action.feedUrl);
    case 'MODIFY_TITLE':
      return modifyTitle(state, action.feedUrl, action.feedTitle);
    default:
      return state;
  }
}
