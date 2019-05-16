import React, { Component } from "react";
import RSSParser from "rss-parser";
import "./App.css";

export default class App extends Component {
  state = {
    links: ['https://d2.naver.com/d2.atom', 'https://meetup.toast.com/rss'],
    result: []
  };

  _addLinks = url => {
    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

    let parser = new RSSParser();
    parser.parseURL(CORS_PROXY + url, (err, feed) => {
      console.log(feed);

      this.setState({
        result: [...this.state.result, feed]
      });

      console.log(this.state);
    });
  };

  componentDidMount() {
    for (const link of this.state.links) {
      this._addLinks(link);
    }
  }

  render() {
    const { result } = this.state;
    let items = [];

    const linkList = result.map((v, i) => {
      items = [...items, ...v.items];

      return (
        <div className="link">
          <a href={v.link} target="_blank" rel="noopener noreferrer">
            {v.title}
          </a>
        </div>
      );
    });

    const itemList = items
      .sort((a, b) => {
        return Date.parse(b.pubDate) - Date.parse(a.pubDate);
      })
      .map((v, i) => {
        return (
          <li>
            <div>
              <a href={v.link} target="_blank" rel="noopener noreferrer">
                {v.title}
              </a>
            </div>
          </li>
        );
      });

    return (
      <div id="App">
        {linkList}
        <ul>{itemList}</ul>
      </div>
    );
  }
}
