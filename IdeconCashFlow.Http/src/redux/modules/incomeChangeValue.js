import { HEADER_INPUT_PROCESS, HEADER_INPUT_PERCENT, HEADER_INPUT_SUCCESS } from '../types';
import createDispatcher from '../../utils/createDispatcher'


export function incomeChangeValue(data) {
    return (dispatch, getState) => {
        dispatch(createDispatcher(HEADER_INPUT_PROCESS, data));
        dispatch(createDispatcher(HEADER_INPUT_SUCCESS, getState().inputHeaders.initialData));
    };
}


export function incomeChangePercent(data) {
    return (dispatch, getState) => {
        dispatch(createDispatcher(HEADER_INPUT_PERCENT, data));
        dispatch(createDispatcher(HEADER_INPUT_SUCCESS, getState().inputHeaders.initialData));
    };
}