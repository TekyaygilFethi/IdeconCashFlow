import React from 'react';
import ReactDOM from 'react-dom';
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


// const { basePath } = window.env;
export const history = createBrowserHistory({
    basename: '',
});
export const store = configureStore(undefined, history);


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
