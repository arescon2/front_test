import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';

import './styles.scss';
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import 'react-toastify/dist/ReactToastify.css';

import { store } from './stores';

import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
