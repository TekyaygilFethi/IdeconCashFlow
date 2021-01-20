import { HEADER_OUTPUT_ADD, HEADER_OUTPUT_SUCCESS, HEADER_OUTPUT_REMOVE } from '../types';
import createDispatcher from '../../utils/createDispatcher'


export function outcomeHeaderAdd(data) {
    return (dispatch, getState) => {
        dispatch(createDispatcher(HEADER_OUTPUT_ADD, data));
        dispatch(createDispatcher(HEADER_OUTPUT_SUCCESS, getState().outputHeaders.initialData));
    };
}

export function outcomeHeaderRemove(data) {
    return (dispatch, getState) => {
        dispatch(createDispatcher(HEADER_OUTPUT_REMOVE, data));
        dispatch(createDispatcher(HEADER_OUTPUT_SUCCESS, getState().outputHeaders.initialData));
    };
}