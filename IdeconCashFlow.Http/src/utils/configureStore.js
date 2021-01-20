import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { devToolsEnhancer } from 'redux-devtools-extension';


import rootReducer from '../redux/modules.index';



const configureStore = (initialState, history) => {
    const middlewares = [thunk, routerMiddleware(history)];
    const composed = [applyMiddleware(...middlewares)];

    if (process.env.NODE_ENV === 'development') {
        if (window.__REDUX_DEVTOOLS_EXTENSION__) {
            composed.push(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
        } else {
            composed.push(devToolsEnhancer({ realtime: true }));
            console.log(
                '%c Go to url for see redux actions: http://remotedev.io/local/ ',
                'background: #222; color: #bada55;  padding:3px 1px',
            );
        }
    }
    const store = createStore(rootReducer(history), initialState, compose(...composed));

    if (process.env.NODE_ENV === 'development' && module.hot) {

        module.hot.accept('../redux', () => {
            store.replaceReducer(rootReducer(history));
        });
    }

    return store;
};

export default configureStore;
