import { MAIN_HEADER_REQUEST, MAIN_HEADER_SUCCESS, MAIN_HEADER_FAILURE } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import api from '../../api';




export function getMainHeaders(data) {
  return dispatch => {
    dispatch(createDispatcher(MAIN_HEADER_REQUEST, data));
    return api
      .mainHeader(data)
      .then(res => {
        dispatch(createDispatcher(MAIN_HEADER_SUCCESS, res.data));
        return res;
      }).catch(err => {
        dispatch(createDispatcher(MAIN_HEADER_FAILURE, err.response));
        return err;
      });
  };
}

export default createReducer({
  mapActionToKey: action => action.type,
  types: [MAIN_HEADER_REQUEST, MAIN_HEADER_SUCCESS, MAIN_HEADER_FAILURE]
});