/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import RSSParser from 'rss-parser';
import PropTypes from 'prop-types';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { faCog, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import './index.scss';

class FeedBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addInputValue: '',
      settingMode: false,
    };
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

  addFeedLink = (requestUrl, urlCheckCnt = 0) => {
    const { onAddFeed } = this.props;
    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
    const parser = new RSSParser();

    const urlCheck = ['rss', 'feed.xml'];

    parser.parseURL(CORS_PROXY + requestUrl, (err, feed) => {
      let modifiedUrl = requestUrl;
      if (requestUrl[requestUrl.length - 1] !== '/') modifiedUrl += '/';

      if (err && urlCheckCnt !== urlCheck.length) {
        let reduceCnt = modifiedUrl.length;
        if (urlCheckCnt > 0) {
          reduceCnt -= urlCheck[urlCheckCnt - 1].length + 1;
        }

        modifiedUrl = modifiedUrl.substr(0, reduceCnt) + urlCheck[urlCheckCnt];

        this.addFeedLink(modifiedUrl, urlCheckCnt + 1);
      } else if (err) {
        console.log('알 수 없는 오류 발생', err);
      } else {
        onAddFeed(requestUrl, feed);
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
        if (!err) {
          onLoadItems(feedKey, responseFeed.items);
        } else {
          console.log('loadFeedItems Error: ', err);
        }
      });
    }
  };

  toogleFeedItems = feedUrl => {
    const { onToggleVisibleItems } = this.props;
    onToggleVisibleItems(feedUrl);
  };

  clickSetting = () => {
    const { settingMode } = this.state;

    const feeds = document.querySelectorAll('.feed-link');

    for (const feed of feeds) {
      const titleInput = feed.querySelector('.title-input').value;
      const titleText = feed.querySelector('.title-text').innerText;

      if (!settingMode) {
        feed.querySelector('.title-input').value = titleText;
      } else {
        feed.querySelector('.title-text').innerText = titleInput;
      }
    }

    this.setState({
      settingMode: !settingMode,
    });
  };

  clickDeleteFeed = e => {
    const { onRemoveFeed } = this.props;

    const feedUrl = e.target.parentNode.querySelector('.feed-link').attributes
      .feedlink.value;

    onRemoveFeed(feedUrl);
  };

  changeFeedTitle = e => {
    const { onModifyTitle } = this.props;

    const targetValue = e.target.value;
    const feedUrl = e.target.parentNode.attributes.feedlink.value;

    onModifyTitle(feedUrl, targetValue);
  };

  render() {
    const { addInputValue, settingMode } = this.state;
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
              if (!settingMode) {
                const feedLink = e.target.attributes.feedlink.value;
                this.toogleFeedItems(feedLink);
              }
            }}
            role="button"
            tabIndex="0"
          >
            <span
              className="title-text"
              style={{ display: settingMode ? 'none' : 'inline' }}
            >
              {v.title}
            </span>
            <input
              type="text"
              className="title-input"
              onChange={this.changeFeedTitle}
              style={{ display: settingMode ? 'inline' : 'none' }}
            />
          </div>
          <div
            style={{ display: settingMode ? 'inline' : 'none' }}
            className="delete-feed-link"
            onClick={this.clickDeleteFeed}
            role="button"
            tabIndex="0"
          >
            -
          </div>
        </li>
      );
    });

    return (
      <div id="FeedBar">
        <div className="feed-bar-header">
          <div className="app-title">
            <h1>Feed Board</h1>
          </div>
          <div className="setting">
            <div
              className={`setting-button ${settingMode ? 'set-on' : 'set-off'}`}
              onClick={this.clickSetting}
              role="button"
              tabIndex={0}
            >
              {settingMode ? <Fa icon={faCheckCircle} /> : <Fa icon={faCog} />}
            </div>
          </div>
        </div>

        <div className="add-feed" style={{ display: settingMode ? 'none' : 'inline' }}>
          <form className="add-form">
            <input
              type="text"
              placeholder="Feed URL"
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
  onRemoveFeed: PropTypes.func.isRequired,
  onModifyTitle: PropTypes.func.isRequired,
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
    onRemoveFeed: feedUrl => {
      dispatch({ type: 'REMOVE_FEED', feedUrl });
    },
    onModifyTitle: (feedUrl, feedTitle) => {
      dispatch({ type: 'MODIFY_TITLE', feedUrl, feedTitle });
    },
  }),
)(FeedBar);
