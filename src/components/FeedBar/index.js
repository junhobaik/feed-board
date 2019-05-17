/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import RSSParser from 'rss-parser';
import PropTypes from 'prop-types';
import './index.scss';

class FeedBar extends Component {
  constructor(props) {
    super(props);
    this.state = { addInputValue: 'http://tech.kakao.com/rss/' };
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
        //
      } else {
        onAddFeed(url, feed);
      }
    });
  };

  render() {
    const { addInputValue } = this.state;
    const { feed } = this.props;

    const feedToArray = [];
    for (const key in feed) {
      feedToArray.push(feed[key]);
    }

    const feedList = feedToArray.map(v => {
      return (
        <li key={v.link}>
          <div className="feed-link">
            <a href={v.link} target="_blank" rel="noopener noreferrer">
              {v.title}
            </a>
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
  }),
)(FeedBar);
