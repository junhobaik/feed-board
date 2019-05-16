import React, { Component } from 'react';
import { connect } from 'react-redux';
import RSSParser from 'rss-parser';

class FeedBar extends Component {
  constructor(props) {
    super(props);
    this.state = { addInputValue: 'https://d2.naver.com/d2.atom' };
  }

  handleChange = event => {
    this.setState({ addInputValue: event.target.value });
  };

  _addFeedLink = url => {
    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

    const parser = new RSSParser();

    parser.parseURL(CORS_PROXY + url, (err, feed) => {
      if (!err) {
        this.props.onAddFeed(feed.title, url, feed.link);
      } else {
        // TODO: 잘못된 주소 || 기타 오류시 처리
      }
    });
  };

  componentDidMount() {
    document.querySelector('.add-form').addEventListener('submit', e => {
      e.preventDefault();

      const { addInputValue } = this.state;

      this._addFeedLink(addInputValue);
      this.setState({
        addInputValue: '',
      });
    });
  }

  render() {
    const { feed } = this.props;

    let feedToArray = [];
    for (let key in feed) {
      console.log(feed);
      const data = feed[key];
      console.log(key, data);

      feedToArray.push({
        title: data.title,
        url: data.siteUrl,
      });
    }

    const feedList = feedToArray.map(v => {
      console.log(v);
      return (
        <li key={v.url}>
          <div className="feed-link">
            <a href={v.url}>{v.title}</a>
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
              value={this.state.addInputValue}
              onChange={this.handleChange}
            />
            <input type="submit" />
          </form>
        </div>

        <div className="feed-list">
          <ul>{feedList}</ul>
        </div>
      </div>
    );
  }
}

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
