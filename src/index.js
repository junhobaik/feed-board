import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers/rootReducer';

const store = createStore(reducer);

store.subscribe(() => {
  localStorage.setItem('feed', JSON.stringify(store.getState().feed));
  console.log('Save localStrage: ', JSON.parse(localStorage.getItem('feed')));
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

serviceWorker.unregister();
