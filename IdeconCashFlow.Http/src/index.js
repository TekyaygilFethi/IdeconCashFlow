import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from 'styled-components';


import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support

import 'flag-icon-css/css/flag-icon.min.css';
import 'animate.css'

import configureStore from './utils/configureStore';
import theme from './utils/theme';
import App from './containers/App';
import * as serviceWorker from './serviceWorker';
import { localStorageData } from './utils/helper';
import setAuthorizationToken from './utils/setAuthorizationToken';
import createDispatcher from './utils/createDispatcher';
import { LOGIN_SUCCESS, SET_USER_DATA,SHOW_PRİCE_TYPE_SET } from './redux/types';

const { REACT_APP_BASE_PATH } = process.env;
export const history = createBrowserHistory({
    basename: REACT_APP_BASE_PATH,
});

export const store = configureStore(undefined, history);

const token = localStorageData.get('token');
const showColums = localStorageData.get('showColums');
// const lang = localStorageData.get('language');


if (token) {
    let jwt = null;
  
    try {
      jwt = jwtDecode(token.data);
    } catch (e) {
      console.error(e);
      localStorageData.delete('token');
    }
  
    if (moment(jwt.exp) < moment().format()) {
      localStorageData.delete('token');
    }
  
    if (jwt) {
      const userData = localStorageData.get('loggedUser');
  
      store.dispatch(createDispatcher(LOGIN_SUCCESS, token.data));
  
      if (userData) {
        // fix me: burada api/me endpintnini bilgileri olmali
        store.dispatch(createDispatcher(SET_USER_DATA, userData.data));
      }
  
      setAuthorizationToken(token.data);
    }
  }

if(showColums){
  store.dispatch(createDispatcher(SHOW_PRİCE_TYPE_SET, showColums.data));
}




const render = Component => {

    ReactDOM.render(
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <ConnectedRouter history={history}>
                    <Component />
                </ConnectedRouter>
            </ThemeProvider>
        </Provider>,
        document.getElementById('root'),
    );
};

if (process.env.NODE_ENV === 'development' && module.hot) {
    // Reload components
    module.hot.accept('./containers/App', () => {
        render(App);
    });
}

render(App);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
