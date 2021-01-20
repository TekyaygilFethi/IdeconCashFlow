import {EXCHANGE_REQUEST,EXCHANGE_SUCCESS,EXCHANGE_FAILURE} from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import api from '../../api';





export function getExchange(data) {
    return dispatch => {
        dispatch(createDispatcher(EXCHANGE_REQUEST, data));
        return api
            .exchanges(data)
            .then(res => {
                dispatch(createDispatcher(EXCHANGE_SUCCESS, res.data));
                return res;
            }).catch(err => {
                dispatch(createDispatcher(EXCHANGE_FAILURE, err.response));
                return err;
            });
    };
}

export default createReducer({
    mapActionToKey: action => action.type,
    types: [EXCHANGE_REQUEST,EXCHANGE_SUCCESS,EXCHANGE_FAILURE]
});