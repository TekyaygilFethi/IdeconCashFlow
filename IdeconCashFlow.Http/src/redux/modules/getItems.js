import { GET_ITEMS_REQUEST, GET_ITEMS_SUCCESS, GET_ITEMS_FAILURE } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import api from '../../api';





export function getItems(data) {
    return dispatch => {
        dispatch(createDispatcher(GET_ITEMS_REQUEST, data));
        return api
            .getItems(data)
            .then(res => {
                dispatch(createDispatcher(GET_ITEMS_SUCCESS, res.data));
                return res;
            }).catch(err => {
                dispatch(createDispatcher(GET_ITEMS_FAILURE, err.response));
                return err;
            });
    };
}

export default createReducer({
    mapActionToKey: action => action.type,
    types: [GET_ITEMS_REQUEST, GET_ITEMS_SUCCESS, GET_ITEMS_FAILURE]
});