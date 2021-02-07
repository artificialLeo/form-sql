import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
import { Auth0Provider } from "@auth0/auth0-react";
import { Provider } from 'react-redux';
import store from "./store/store";

ReactDOM.render(
  <Auth0Provider
    domain="dev-14ezxikg.eu.auth0.com"
    clientId="P1i3AejA12C0Mqz1aVygC27wVKM6bdkH"
    redirectUri={window.location.origin}
    audience="http://localhost:3000/login-photo-app"
  >
    <Provider store={store}>
      <App />
    </Provider>,
  </Auth0Provider>,
  document.getElementById('root')
);
