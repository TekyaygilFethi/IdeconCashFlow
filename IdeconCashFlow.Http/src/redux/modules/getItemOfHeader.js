import { GET_ITEM_OF_HEADERS_REQUEST, GET_ITEM_OF_HEADERS_SUCCESS, GET_ITEM_OF_HEADERS_FAILURE } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import api from '../../api';





export function getItemOfHeader(data) {
    return dispatch => {
        dispatch(createDispatcher(GET_ITEM_OF_HEADERS_REQUEST, data));
        return api
            .getItemsOfHeaders(data)
            .then(res => {
                dispatch(createDispatcher(GET_ITEM_OF_HEADERS_SUCCESS, res.data));
                return res;
            }).catch(err => {
                dispatch(createDispatcher(GET_ITEM_OF_HEADERS_FAILURE, err.response));
                return err;
            });
    };
}

export default createReducer({
    mapActionToKey: action => action.type,
    types: [GET_ITEM_OF_HEADERS_REQUEST, GET_ITEM_OF_HEADERS_SUCCESS, GET_ITEM_OF_HEADERS_FAILURE]
});