import { HEADER_MAIN_TOTALS_REQUEST, HEADER_MAIN_TOTALS_SUCCESS, HEADER_MAIN_TOTALS_FAILURE } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import api from '../../api';





export function getMainHeaderTotals(data) {
  return dispatch => {
    dispatch(createDispatcher(HEADER_MAIN_TOTALS_REQUEST, data));
    return api
      .mainTotals(data)
      .then(res => {
        dispatch(createDispatcher(HEADER_MAIN_TOTALS_SUCCESS, res.data));
        return res;
      }).catch(err => {
        dispatch(createDispatcher(HEADER_MAIN_TOTALS_FAILURE, err.response));
        return err;
      });
  };
}

export default createReducer({
  mapActionToKey: action => action.type,
  types: [HEADER_MAIN_TOTALS_REQUEST, HEADER_MAIN_TOTALS_SUCCESS, HEADER_MAIN_TOTALS_FAILURE]
})