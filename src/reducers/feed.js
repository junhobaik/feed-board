import _ from 'lodash';

const storageData = JSON.parse(localStorage.getItem('feed'));

const initialState = storageData || {
  // TODO: 차후 테스트용 데이터 제거
  feed: {
    d2Blog: {
      rssUrl: 'https://d2.naver.com/d2.atom',
      siteUrl: 'http://d2.naver.com',
      title: 'D2 Blog',
    },
    toastMeetup: {
      rssUrl: 'https://meetup.toast.com/rss',
      siteUrl: 'https://meetup.toast.com',
      title: 'TOAST Meetup',
    },
  },
};

function addFeed(state, title, rssUrl, siteUrl) {
  const { feed } = state;
  const feedName = feed[_.camelCase(title)] || undefined;

  if (feedName) {
    return state;
  } else {
    return {
      feed: {
        ...feed,
        [_.camelCase(title)]: {
          title,
          rssUrl,
          siteUrl,
        },
      },
    };
  }
}

export default function feed(state = initialState, action) {
  switch (action.type) {
    case 'ADD_FEED':
      return addFeed(state, action.title, action.rssUrl, action.siteUrl);
    default:
      return state;
  }
}
