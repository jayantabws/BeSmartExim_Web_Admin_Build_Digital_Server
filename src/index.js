import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import "./i18n";
import * as serviceWorker from './serviceWorker';
// import store from './store/store';
// import { Provider } from "react-redux";

// const app = (
//   <Provider store={store}>
//      <React.StrictMode>
//       <App />
//      </React.StrictMode>
//   </Provider>
// );

ReactDOM.render(
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  , document.getElementById('root'));

serviceWorker.unregister();