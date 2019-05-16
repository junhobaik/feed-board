/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import RSSParser from 'rss-parser';
import PropTypes from 'prop-types';
import './index.scss';

class FeedBar extends Component {
  constructor(props) {
    super(props);
    this.state = { addInputValue: 'http://woowabros.github.io/feed.xml' };
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

  addFeedLink = url => {
    const { onAddFeed } = this.props;
    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

    const parser = new RSSParser();

    parser.parseURL(CORS_PROXY + url, (err, feed) => {
      if (!err) {
        onAddFeed(feed.title, url, feed.link);
      } else {
        // TODO: 잘못된 주소 || 기타 오류시 처리
      }
    });
  };

  render() {
    const { addInputValue } = this.state;
    const { feed } = this.props;

    const feedToArray = [];
    for (const key in feed) {
      const data = feed[key];

      feedToArray.push({
        title: data.title,
        url: data.siteUrl,
      });
    }

    const feedList = feedToArray.map(v => {
      return (
        <li key={v.url}>
          <div className="feed-link">
            <a href={v.url} target="_blank" rel="noopener noreferrer">
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
    onAddFeed: (title, rssUrl, siteUrl) => {
      dispatch({ type: 'ADD_FEED', title, rssUrl, siteUrl });
    },
  }),
)(FeedBar);
