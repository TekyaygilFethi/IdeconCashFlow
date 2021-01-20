import { SHOW_PRİCE_TYPE_SET } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import { localStorageData } from '../../utils/helper';

import { history } from '../../index';

export function setColumns(columns) {
    return dispatch => {
        
        localStorageData.delete('showColums');
        localStorageData.set('showColums',columns);

        dispatch(createDispatcher(SHOW_PRİCE_TYPE_SET, columns));
    };
}

export const columns = (state = {}, action = {}) => {
    switch (action.type) {
      case SHOW_PRİCE_TYPE_SET: {
        return action.data;
      }
  
      default:
        return state;
    }
  };