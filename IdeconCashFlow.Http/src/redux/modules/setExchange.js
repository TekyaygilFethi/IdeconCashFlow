import { SET_EXCHANGE, HEADER_INPUT_SUCCESS, HEADER_OUTPUT_SUCCESS } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import _ from 'lodash';

export function setExchange(data) {
    return (dispatch, getState) => {

        if (_.isEmpty(data.value)) {
            data = null;
        }
        dispatch(createDispatcher(SET_EXCHANGE, data));
        dispatch(createDispatcher(HEADER_INPUT_SUCCESS, getState().inputHeaders.initialData));
        dispatch(createDispatcher(HEADER_OUTPUT_SUCCESS, getState().outputHeaders.initialData));
    };
}