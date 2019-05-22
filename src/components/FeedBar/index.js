/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import RSSParser from 'rss-parser';
import PropTypes from 'prop-types';
import './index.scss';

class FeedBar extends Component {
  constructor(props) {
    super(props);
    this.state = { addInputValue: '' };
  }

  componentDidMount() {
    document.querySelector('.add-form').addEventListener('submit', e => {
      e.preventDefault();

      const { addInputValue } = this.state;

      this.addFeedLink(addInputValue);
      this.setState({
        addInputValue: '',
      });
    });
  }

  handleChange = event => {
    this.setState({ addInputValue: event.target.value });
  };

  addFeedLink = (url, urlCheckCnt = 0) => {
    const { onAddFeed } = this.props;
    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

    const parser = new RSSParser();

    const urlCheck = ['rss', 'feed.xml'];

    parser.parseURL(CORS_PROXY + url, (err, feed) => {
      if (err && urlCheckCnt !== urlCheck.length) {
        let url2;
        if (url[url.length - 1] === '/') {
          url2 = url + urlCheck[urlCheckCnt];
        } else {
          url2 = `${url}/${urlCheck[urlCheckCnt]}`;
        }

        this.addFeedLink(url2, urlCheckCnt + 1);
      } else if (err) {
        // TODO: 잘못된 주소, 알수 없는 오류 처리
      } else {
        onAddFeed(url, feed);
      }
    });
  };

  loadFeedItems = (feedKey, feed) => {
    const { onLoadItems } = this.props;
    const today = new Date();
    const loadDate = new Date(feed.lastLoadDate);

    if ((today - loadDate) / (60 * 60 * 1000) > 24) {
      const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
      const parser = new RSSParser();

      parser.parseURL(CORS_PROXY + feed.feedUrl, (err, responseFeed) => {
        onLoadItems(feedKey, responseFeed.items);
      });
    }
  };

  toogleFeedItems = feedUrl => {
    const { onToggleVisibleItems } = this.props;
    onToggleVisibleItems(feedUrl);
  };

  render() {
    const { addInputValue } = this.state;
    const { feed } = this.props;

    const feedToArray = [];
    for (const key in feed) {
      const feedData = feed[key];
      this.loadFeedItems(key, feedData);
      feedToArray.push(feedData);
    }

    const feedList = feedToArray.map(v => {
      return (
        <li key={v.link}>
          <div
            className={`feed-link ${v.showItems ? 'items-show' : 'items-hide'}`}
            feedlink={v.link}
            onClick={e => {
              const feedLink = e.target.attributes.feedlink.value;
              this.toogleFeedItems(feedLink);
            }}
            role="button"
            tabIndex="0"
          >
            {v.title}
          </div>
        </li>
      );
    });

    return (
      <div id="FeedBar">
        <div className="add-feed">
          <form className="add-form">
            <input
              type="text"
              placeholder="Add Feed"
              value={addInputValue}
              onChange={this.handleChange}
            />
            <input type="submit" value="+" />
          </form>
        </div>

        <div className="feed-list">
          <ul>{feedList}</ul>
        </div>
      </div>
    );
  }
}

FeedBar.propTypes = {
  onAddFeed: PropTypes.func.isRequired,
  onLoadItems: PropTypes.func.isRequired,
  onToggleVisibleItems: PropTypes.func.isRequired,
  feed: PropTypes.object.isRequired,
};

export default connect(
  state => ({
    feed: state.feed.feed,
  }),
  dispatch => ({
    onAddFeed: (feedUrl, feed) => {
      dispatch({ type: 'ADD_FEED', feedUrl, feed });
    },
    onLoadItems: (feedKey, feedItems) => {
      dispatch({ type: 'LOAD_ITEMS', feedKey, feedItems });
    },
    onToggleVisibleItems: feedUrl => {
      dispatch({ type: 'TOGGLE_VISIBLE_ITEMS', feedUrl });
    },
  }),
)(FeedBar);
