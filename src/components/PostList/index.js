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
      if (feed[key].showItems) {
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
    }

    allItems.sort((a, b) => {
      return new Date(b.pubDate) - new Date(a.pubDate);
    });

    const itemList = allItems.map(v => {
      const { title, feedTitle, feedLink } = v;
      let { contentSnippet, pubDate } = v;
      pubDate = moment(moment(pubDate).format('YYMMDD'), 'YYMMDD').fromNow();
      contentSnippet = contentSnippet.substr(0, 100);
      return (
        <li className="feed-item" key={v.link}>
          <div className="item-wrap">
            <a href={v.link} target="_blank" rel="noopener noreferrer">
              <p className="title">{title}</p>
            </a>

            <a
              href={feedLink}
              className="feed-info"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{`${feedTitle} / ${pubDate}`}</span>
            </a>

            <div className="content">
              <a href={v.link} target="_blank" rel="noopener noreferrer">
                {contentSnippet}
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
