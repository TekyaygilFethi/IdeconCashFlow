import {GET_DETAIL_REQUEST,GET_DETAIL_SUCCESS,GET_DETAIL_FAILURE} from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import api from '../../api';





export function getDetail(data) {
    return dispatch => {
        dispatch(createDispatcher(GET_DETAIL_REQUEST, data));
        return api
            .getDetail(data)
            .then(res => {
                dispatch(createDispatcher(GET_DETAIL_SUCCESS, res.data));
                return res;
            }).catch(err => {
                dispatch(createDispatcher(GET_DETAIL_FAILURE, err.response));
                return err;
            });
    };
}

export default createReducer({
    mapActionToKey: action => action.type,
    types: [GET_DETAIL_REQUEST,GET_DETAIL_SUCCESS,GET_DETAIL_FAILURE]
});