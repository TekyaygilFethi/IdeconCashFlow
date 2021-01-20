import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, SET_USER_DATA } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import { localStorageData } from '../../utils/helper';
import api from '../../api';
import jwtDecode from 'jwt-decode';
import setAuthorizationToken from '../../utils/setAuthorizationToken';

export function auth(data) {
    return dispatch => {
        dispatch(createDispatcher(LOGIN_REQUEST, data));
        return api
            .auth(data)
            .then(res => {
                const token  = res.data.response;
                setAuthorizationToken(token);

                const user = jwtDecode(token);
                localStorageData.set('token', token);

                dispatch(createDispatcher(LOGIN_SUCCESS, res.data));
                localStorageData.set('loggedUser', user, user.exp);
                // localStorageData.set('userData', res.data, user.exp);

                dispatch(createDispatcher(SET_USER_DATA, user));

                return res;
            }).catch(err => {
                dispatch(createDispatcher(LOGIN_FAILURE, err.response));
                return err;
            });
    };
}

export const authorization = createReducer({
    mapActionToKey: action => action.type,
    types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE]
});

export const loggedUser = (state = {}, action = {}) => {
    switch (action.type) {
      case SET_USER_DATA: {
        return action.data;
      }
  
      default:
        return state;
    }
  };