import _ from 'lodash';

const storageData = JSON.parse(localStorage.getItem('feed'));

const initialState = storageData || {
  // TODO: 차후 테스트용 데이터 제거
  feed: {
    우아한형제들기술블로그: {
      description:
        '이 블로그는 배달의민족, 배민라이더스, 배민상회 등 Food Tech를 선도하는 우아한형제들 기술조직의 성장 일기를 다루는 블로그입니다.',
      feedUrl: 'http://woowabros.github.io/feed.xml',
      generator: 'Jekyll v3.8.5',
      items: [],
      lastBuildDate: 'Fri, 10 May 2019 10:10:19 +0900',
      link: 'http://woowabros.github.io/',
      pubDate: 'Fri, 10 May 2019 10:10:19 +0900',
      title: '우아한형제들 기술 블로그',
    },
  },
};

function addFeed(state, feedUrl, feedData) {
  // eslint-disable-next-line no-shadow
  const { feed } = state;
  const feedName = feed[_.camelCase(feedData.title)] || undefined;

  if (feedName) {
    return state;
  }
  return {
    feed: {
      ...feed,
      [_.camelCase(feedData.title)]: {
        ...feedData,
        feedUrl: feedData.feedUrl || feedUrl,
      },
    },
  };
}

export default function feed(state = initialState, action) {
  switch (action.type) {
    case 'ADD_FEED':
      return addFeed(state, action.feedUrl, action.feed);
    default:
      return state;
  }
}
