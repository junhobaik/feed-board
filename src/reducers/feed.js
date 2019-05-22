import _ from 'lodash';

const storageData = JSON.parse(localStorage.getItem('feed'));

const initialState = storageData || {
  feed: {},
};

function addFeed(state, feedUrl, feedData) {
  // eslint-disable-next-line no-shadow
  const { feed } = state;
  const feedName = feed[_.snakeCase(feedUrl)] || undefined;

  if (feedName) {
    return state;
  }

  return {
    feed: {
      ...feed,
      [_.snakeCase(feedUrl)]: {
        ...feedData,
        feedUrl: feedData.feedUrl || feedUrl,
        lastLoadDate: new Date(),
        showItems: true,
      },
    },
  };
}

function loadItems(state, feedKey, feedItems) {
  // eslint-disable-next-line no-shadow
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

function toggleVisibleItems(state, feedUrl) {
  // eslint-disable-next-line no-shadow
  const { feed } = state;
  const feedKey = _.snakeCase(feedUrl);
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

export default function feed(state = initialState, action) {
  switch (action.type) {
    case 'ADD_FEED':
      return addFeed(state, action.feedUrl, action.feed);
    case 'LOAD_ITEMS':
      return loadItems(state, action.feedKey, action.feedItems);
    case 'TOGGLE_VISIBLE_ITEMS':
      return toggleVisibleItems(state, action.feedUrl);
    default:
      return state;
  }
}
