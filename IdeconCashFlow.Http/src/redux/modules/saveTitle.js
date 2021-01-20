import {SAVE_TITLE_REQUEST,SAVE_TITLE_SUCCESS,SAVE_TITLE_FAILURE} from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import api from '../../api';


export function saveTitle(data) {
    return dispatch => {
        dispatch(createDispatcher(SAVE_TITLE_REQUEST, data));
        return api
            .saveTitle(data)
            .then(res => {
                dispatch(createDispatcher(SAVE_TITLE_SUCCESS, res.data));
                return res;
            }).catch(err => {
                dispatch(createDispatcher(SAVE_TITLE_FAILURE, err.response));
                return err;
            });
    };
}

export default createReducer({
    mapActionToKey: action => action.type,
    types: [SAVE_TITLE_REQUEST,SAVE_TITLE_SUCCESS,SAVE_TITLE_FAILURE]
});