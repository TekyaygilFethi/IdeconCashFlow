import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, SET_USER_DATA } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import { localStorageData } from '../../utils/helper';
import api from '../../api';
import jwtDecode from 'jwt-decode';
import setAuthorizationToken from '../../utils/setAuthorizationToken';

import { history } from '../../index';

export function logout(location) {
    return dispatch => {
        
        // remove token from header
        setAuthorizationToken(false);

        localStorageData.delete('token');
        localStorageData.delete('loggedUser');
        // localStorageData.delete('userData');

        dispatch(createDispatcher(LOGIN_SUCCESS, {}));
        dispatch(createDispatcher(SET_USER_DATA, {}));



        history.push('/login', { from: location });
    };
}

export default createReducer({
    mapActionToKey: action => action.type,
    types: [LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE]
});