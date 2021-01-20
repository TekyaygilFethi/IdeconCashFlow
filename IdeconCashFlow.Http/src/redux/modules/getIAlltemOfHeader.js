import { GET_ALL_ITEM_OF_HEADERS_REQUEST, GET_ALL_ITEM_OF_HEADERS_SUCCESS, GET_ALL_ITEM_OF_HEADERS_REMOVE, GET_ALL_ITEM_OF_HEADERS_FAILURE } from '../types';
import createDispatcher from '../../utils/createDispatcher'
import createReducer from '../../utils/createReducer';
import api from '../../api';





export function getAllItemOfHeader(data) {
    return dispatch => {
        dispatch(createDispatcher(GET_ALL_ITEM_OF_HEADERS_REQUEST, data));
        return api
            .getItemsOfHeader(data)
            .then(res => {
                dispatch(createDispatcher(GET_ALL_ITEM_OF_HEADERS_SUCCESS, res.data));
                return res;
            }).catch(err => {
                dispatch(createDispatcher(GET_ALL_ITEM_OF_HEADERS_FAILURE, err.response));
                return err;
            });
    };
}




export default function reducer(
    state = {
        isFetching: false,
        isLoaded: false,
        isFailure: false,
    },
    action,
) {
    switch (action.type) {
        case GET_ALL_ITEM_OF_HEADERS_REQUEST:
            return { ...state, isFetching: true, isFailure: false, isLoaded: false, data: action.data };
        case GET_ALL_ITEM_OF_HEADERS_SUCCESS:
            let totalData = action.data.response.items.reduce((total, item, i) => {
                if (item.currency in total) {
                    total[item.currency] = total[item.currency] + item.amount
                } else {
                    total[item.currency] = item.amount
                }

                return total;
            }, {});


            return { ...state, isFetching: false, isFailure: false, isLoaded: true, data: action.data, currencyTotals: totalData };
        case GET_ALL_ITEM_OF_HEADERS_REMOVE:
            action.data.response.reduce((total, item, i) => {
                if (item.isSuccess) {
                    state.data.response.items = state.data.response.items.filter(x => x.id !== item.response);
                }
                return total;
            }, [])

            return { ...state, isFetching: false, isFailure: false, isLoaded: true, data: state.data };
        case GET_ALL_ITEM_OF_HEADERS_FAILURE:
            return { ...state, isFetching: false, isFailure: true, isLoaded: false, data: action.data };
        default:
            return state;
    }
}



function exchange(exchanges, to, from, price) {

    let response = '';
    if (exchanges.isLoaded) {
        const mainExchange = exchanges.data.response.mainExchange;
        const exchangeData = exchanges.data.response.exchanges;
        //kur değişiminde ana para türündeyse çarp yolla
        if (to.toLocaleUpperCase() === mainExchange.toLocaleUpperCase()) {
            const rate = exchangeData.find(x => x.key.toLocaleUpperCase() === from.toLocaleUpperCase()).value;

            response = rate * price;
        } else {
            const toRate = exchangeData.find(x => x.key.toLocaleUpperCase() === to.toLocaleUpperCase()).value;
            const fromRate = exchangeData.find(x => x.key.toLocaleUpperCase() === from.toLocaleUpperCase()).value;
            const rate = fromRate / toRate;

            response = rate * price;
        }
    }
    return response;
}