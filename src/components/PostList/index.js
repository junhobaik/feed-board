/* eslint-disable no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import './index.scss';

// eslint-disable-next-line react/prefer-stateless-function
class PostList extends Component {
  static propTypes = {
    feed: PropTypes.object.isRequired,
  };

  render() {
    const { feed } = this.props;

    const allItems = [];
    for (const key in feed) {
      for (const item of feed[key].items) {
        const {
          content,
          contentSnippet,
          guid,
          isoDate,
          link,
          pubDate,
          title,
        } = item;

        allItems.push({
          feedTitle: feed[key].title,
          feedLink: feed[key].link,
          content,
          contentSnippet,
          guid,
          isoDate,
          link,
          pubDate,
          title,
        });
      }
    }

    const itemList = allItems.map(v => {
      const { title, feedTitle, feedLink } = v;
      let { contentSnippet, pubDate } = v;
      pubDate = moment(moment(pubDate).format('YYMMDD'), 'YYMMDD').fromNow();
      contentSnippet = contentSnippet.substr(0, 100);
      return (
        <li className="feed-item" key={v.link}>
          <div className="item-wrap">
            <div className="item-info">
              <a href={v.link} target="_blank" rel="noopener noreferrer">
                <p>
                  <span className="title">{title}</span>
                  <span> - </span>
                  <span className="date">{pubDate}</span>
                </p>
                <div className="content">{contentSnippet}</div>
              </a>
            </div>
            <div className="feed-info">
              <a
                href={feedLink}
                className="feed-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="feed">{feedTitle}</p>
              </a>
            </div>
          </div>
        </li>
      );
    });

    return (
      <div id="PostList">
        <ul>{itemList}</ul>
      </div>
    );
  }
}

export default connect(state => ({
  feed: state.feed.feed,
}))(PostList);
