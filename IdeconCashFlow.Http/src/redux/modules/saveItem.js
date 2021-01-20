import { SAVE_ITEM_REQUEST, SAVE_ITEM_SUCCESS, SAVE_ITEM_FAILURE } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import api from '../../api';
import { getInputHeaders } from './inputHeader'

export function saveItem(data) {
    return dispatch => {
        dispatch(createDispatcher(SAVE_ITEM_REQUEST, data));
        return api
            .saveItem(data)
            .then(res => {
                dispatch(createDispatcher(SAVE_ITEM_SUCCESS, res.data)).then(
                    () => {
                        dispatch(getInputHeaders())
                    }
                );
                return res;
            }).catch(err => {
                dispatch(createDispatcher(SAVE_ITEM_FAILURE, err.response));
                return err;
            });
    };
}

export default createReducer({
    mapActionToKey: action => action.type,
    types: [SAVE_ITEM_REQUEST, SAVE_ITEM_SUCCESS, SAVE_ITEM_FAILURE]
});