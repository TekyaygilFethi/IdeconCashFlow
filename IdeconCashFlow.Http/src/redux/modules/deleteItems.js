import { DELETE_ITEMS_REQUEST, DELETE_ITEMS_SUCCESS, DELETE_ITEMS_FAILURE, GET_ALL_ITEM_OF_HEADERS_REMOVE, GET_ALL_ITEM_OF_HEADERS_SUCCESS } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import api from '../../api';

import { toast } from 'react-toastify';
toast.configure({
    autoClose: 2000,
    draggable: true,
    closeOnClick: true,
});



export function deleteItems(data) {
    return (dispatch, getState) => {
        dispatch(createDispatcher(DELETE_ITEMS_REQUEST, data));
        return api
            .deleteItems(data)
            .then(res => {
                dispatch(createDispatcher(GET_ALL_ITEM_OF_HEADERS_REMOVE, res.data));
                dispatch(createDispatcher(GET_ALL_ITEM_OF_HEADERS_SUCCESS, getState().itemAllOfHeaders.data));
                dispatch(createDispatcher(DELETE_ITEMS_SUCCESS, res.data));
                toast.success("Silme işlemi başarılı", { position: toast.POSITION.BOTTOM_RIGHT })

                return res;
            }).catch(err => {
                dispatch(createDispatcher(DELETE_ITEMS_FAILURE, err.response));
                return err;
            });
    };
}

export default createReducer({
    mapActionToKey: action => action.type,
    types: [DELETE_ITEMS_REQUEST, DELETE_ITEMS_SUCCESS, DELETE_ITEMS_FAILURE]
});