import React from 'react';
import './App.css';
import FeedBar from './components/FeedBar';
import PostList from './components/PostList';

export default function App() {
  return (
    <div id="App">
      <FeedBar />
      <PostList />
    </div>
  );
}
