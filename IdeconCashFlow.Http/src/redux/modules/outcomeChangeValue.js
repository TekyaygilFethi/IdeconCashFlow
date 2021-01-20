import { HEADER_OUTPUT_PROCESS, HEADER_OUTPUT_SUCCESS, HEADER_OUTPUT_PERCENT } from '../types';
import createDispatcher from '../../utils/createDispatcher'


export function outcomeChangeValue(data) {
    return (dispatch, getState) => {
        dispatch(createDispatcher(HEADER_OUTPUT_PROCESS, data));
        dispatch(createDispatcher(HEADER_OUTPUT_SUCCESS, getState().outputHeaders.initialData));
    };
}


export function outcomeChangePercent(data) {
    return (dispatch, getState) => {
        dispatch(createDispatcher(HEADER_OUTPUT_PERCENT, data));
        dispatch(createDispatcher(HEADER_OUTPUT_SUCCESS, getState().outputHeaders.initialData));
    };
}