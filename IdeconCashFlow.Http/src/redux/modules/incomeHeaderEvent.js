import { HEADER_INPUT_ADD, HEADER_INPUT_SUCCESS, HEADER_INPUT_REMOVE } from '../types';
import createDispatcher from '../../utils/createDispatcher'


export function incomeHeaderAdd(data) {
    return (dispatch, getState) => {
        dispatch(createDispatcher(HEADER_INPUT_ADD, data));
        dispatch(createDispatcher(HEADER_INPUT_SUCCESS, getState().inputHeaders.initialData));
    };
}

export function incomeHeaderRemove(data) {
    return (dispatch, getState) => {
        dispatch(createDispatcher(HEADER_INPUT_REMOVE, data));
        dispatch(createDispatcher(HEADER_INPUT_SUCCESS, getState().inputHeaders.initialData));
    };
}