import { HEADER_INPUT_REQUEST,HEADER_INPUT_SUCCESS,HEADER_INPUT_FAILURE } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import api from '../../api';





export function getInputHeaders(data) {
    return dispatch => {
      dispatch(createDispatcher(HEADER_INPUT_REQUEST, data));  
      return api
        .inputHeaders(data)
        .then(res => {
          dispatch(createDispatcher(HEADER_INPUT_SUCCESS, res.data));
          return res;
        }).catch(err => {
          dispatch(createDispatcher(HEADER_INPUT_FAILURE, err.response));
          return err;
        });
    };
  }

  export default createReducer({
      mapActionToKey:action=> action.type,
      types:[HEADER_INPUT_REQUEST,HEADER_INPUT_SUCCESS,HEADER_INPUT_FAILURE]
  });