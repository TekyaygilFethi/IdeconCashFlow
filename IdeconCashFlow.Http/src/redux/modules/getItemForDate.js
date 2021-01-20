import { GET_ITEM_FROM_DATE_REQUEST, GET_ITEM_FROM_DATE_SUCCESS, GET_ITEM_FROM_DATE_FAILURE, GET_ITEM_FROM_DATE_CLEAR } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import api from '../../api';





export function getItemForDate(data) {
    return dispatch => {
        dispatch(createDispatcher(GET_ITEM_FROM_DATE_REQUEST, data));
        return api
            .getItemsPerDate(data)
            .then(res => {
                dispatch(createDispatcher(GET_ITEM_FROM_DATE_SUCCESS, res.data));
                return res;
            }).catch(err => {
                dispatch(createDispatcher(GET_ITEM_FROM_DATE_FAILURE, err.response));
                return err;
            });
    };
}

export function clearItemForDate() {
    return dispatch => {
        dispatch(createDispatcher(GET_ITEM_FROM_DATE_CLEAR));
    }
}

export default createReducer({
    mapActionToKey: action => action.type,
    types: [GET_ITEM_FROM_DATE_REQUEST, GET_ITEM_FROM_DATE_SUCCESS, GET_ITEM_FROM_DATE_FAILURE, GET_ITEM_FROM_DATE_CLEAR]
});