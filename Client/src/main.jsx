// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // <-- CHANGE #1: Import HashRouter
import App from './app/App';
import './shared/styles/globalScrollbar.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter> {/* <-- CHANGE #2: Use HashRouter here */}
    <App />
  </HashRouter>
);

// Keep this HMR block! It's harmless and only works in development.
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload();
  });
}