import { HEADER_INPUT_REQUEST, HEADER_INPUT_SUCCESS, HEADER_INPUT_FAILURE, HEADER_INPUT_EXCHANGE, SET_EXCHANGE, HEADER_INPUT_PROCESS, HEADER_INPUT_LANG, HEADER_INPUT_ADD, HEADER_INPUT_REMOVE, HEADER_INPUT_PERCENT } from '../types';
import createDispatcher from '../../utils/createDispatcher';
import api from '../../api';
import _ from 'lodash';
import React from 'react';
import { currencyType, localeAmountPrice } from '../../utils/helper';
import { FormattedMessage } from "react-intl";

export function getInputHeaders(data) {
  return (dispatch, getState) => {
    dispatch(createDispatcher(HEADER_INPUT_REQUEST, data));
    return api
      .inputHeaders(data)
      .then(res => {
        dispatch(createDispatcher(HEADER_INPUT_EXCHANGE, getState().exchanges));
        dispatch(createDispatcher(HEADER_INPUT_LANG, getState().locale.lang));
        dispatch(createDispatcher(HEADER_INPUT_SUCCESS, res.data));
        return res;
      }).catch(err => {
        dispatch(createDispatcher(HEADER_INPUT_FAILURE, err.response));
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
    case HEADER_INPUT_REQUEST:
      return { ...state, isFetching: true, isFailure: false, isLoaded: false, data: action.data };
    case HEADER_INPUT_SUCCESS:
      let columns = [];
      let incomeArrayIds = [];
      let incomeOptions = {};
      let newData = [];

      let firstData = _.cloneDeep(action.data);
      //Gösterilecek para birimlerinin listesini alıyorum
      columns = (firstData.response.headers.income[0].currencies).reduce((columns, currency, i) => {
        columns.push({
          value: currency.key,
          label: currency.key.toLocaleUpperCase() + " (" + currencyType(currency.key.toLocaleUpperCase()).symbol + ")",
        });
        return columns;
      }, []);


      if (!_.isUndefined(state.percentArray)) {

        state.percentArray.reduce((total, item, i) => {
          let incomeIndex = firstData.response.headers.income.findIndex(x => x.id === item.id);
          if (incomeIndex > -1) {
            firstData.response.headers.income[incomeIndex].percent = item.value;

            if (item.value !== 0) {
              firstData.response.headers.income[incomeIndex].currencies.reduce((ttl, currency, indx) => {
                let totalIndex = firstData.response.headers.incomeTotals.findIndex(x => x.key === currency.key)
                firstData.response.headers.incomeTotals[totalIndex].value = firstData.response.headers.incomeTotals[totalIndex].value +
                  (currency.value * ((100 + item.value) / 100) - currency.value)

                currency.value = currency.value * ((100 + item.value) / 100)
                return ttl;
              }, 0)
            }

          }
          return total
        }, 0)



      }

      //Gelen masrafların içindeki itemların id listesini alıyorum
      incomeArrayIds = (firstData.response.headers.income).reduce((columns, item, i) => {
        columns.push({ headerID: item.id, symbol: "+" })
        return columns;
      }, []);

      //Gelen masrafların ayalarını objeye çeviriyorum.
      incomeOptions = {
        page: firstData.response.page,
        sizePerPage: firstData.response.sizePerPage,
        totalSize: firstData.response.totalSize
      }
      // Gelen masrafları tabloda gösterilmesi için ortak bir yapıya çeviriyorum.
      newData = firstData.response.headers.income.reduce((total, item, i) => {
        let currencyObj = columns.reduce((columnTotal, currency, j) => {
          let dataObj = {};
          if (!_.isEmpty(state.convertedExchange) && state.convertedExchange.value !== currency.value && !_.isEmpty(state.convertedExchange.value)) {
            dataObj.price = (exchange(state.exchange, state.convertedExchange.value, currency.value, Math.abs(item.currencies.find(o => o.key === currency.value).value)))
            dataObj.symbol = state.convertedExchange.value
          } else {
            dataObj.price = (Math.abs(item.currencies.find(o => o.key === currency.value).value))
            dataObj.symbol = item.currencies.find(o => o.key === currency.value).key
          }
          columnTotal[currency.value] = dataObj
          return columnTotal;
        }, {});

        currencyObj.key = item.id + i;
        currencyObj.flowDirection = "+"
        currencyObj.direction = <FormattedMessage id="header.incomeExplanation" />;
        currencyObj.title = state.lang === 'tr' ? item.TurkishTitle : item.EnglishTitle
        currencyObj.id = item.id;
        currencyObj.detail = item.isSimilation
        currencyObj.percent = _.isUndefined(item.percent) ? 0 : item.percent
        total.push(currencyObj);
        return total;
      }, []);


      let incomeTotalsData = _.cloneDeep(firstData.response.headers.incomeTotals);
      if (!_.isEmpty(state.convertedExchange) && !_.isEmpty(state.convertedExchange.value)) {
        incomeTotalsData = incomeTotalsData.reduce((total, item) => {
          if (state.convertedExchange.value !== item.key) {
            item.value = (exchange(state.exchange, state.convertedExchange.value, item.key, Math.abs(item.value)))
          }
          item.symbol = state.convertedExchange.value
          total.push(item)
          return total;
        }, [])
      }


      //GRAFİK İÇİN
      let inTotalPieData = firstData.response.headers.incomeTotals.reduce((total, item) => {
        total = total + exchange(state.exchange, "TRY", item.key, Math.abs(item.value))
        return total;
      }, 0)

      let incomePieData = firstData.response.headers.income.reduce((total, content) => {
        let result = content.currencies.reduce((contentTotal, item, j) => {
          contentTotal = contentTotal + exchange(state.exchange, "TRY", item.key, Math.abs(item.value))
          return contentTotal;
        }, 0)
        total.push({ id: content.id, text: state.lang === "tr" ? content.TurkishTitle : content.EnglishTitle, value: result, color: '#80be35' })
        return total;
      }, [])


      return {
        ...state, isFetching: false, isFailure: false, isLoaded: true,
        initialData: action.data, data: newData, income: action.data.response.headers.income,
        incomeTotals: incomeTotalsData, columns, incomeArrayIds, incomeOptions,
        inTotalPieData, incomePieData
      };
    case HEADER_INPUT_PROCESS:
      let data = _.cloneDeep(state.initialData);
      let index = data.response.headers.income.findIndex(x => x.id === action.data.id)
      let currencyIndex = data.response.headers.income[index].currencies.findIndex((e) => e.key === action.data.currency)
      let dataIndex = data.response.headers.incomeTotals.findIndex((e) => e.key === action.data.currency);

      // kur çevirimi varsa o kur çevirimim üzerinden para ekliyor o yüzden çevrim yapılması lazım
      if (!_.isEmpty(state.convertedExchange) && state.convertedExchange.value !== action.data.currency) {
        action.data.value = exchange(state.exchange, action.data.currency, state.convertedExchange.value, parseFloat(action.data.value))
      }

      data.response.headers.incomeTotals[dataIndex].value = data.response.headers.incomeTotals[dataIndex].value - (Math.abs(data.response.headers.income[index].currencies[currencyIndex].value) - action.data.value)
      data.response.headers.income[index].currencies[currencyIndex].value = parseFloat(action.data.value)

      return { ...state, isFetching: false, isFailure: false, isLoaded: true, initialData: data };
    case HEADER_INPUT_ADD:
      let initialdata = _.cloneDeep(state.initialData);
      initialdata.response.headers.income.push(action.data);
      return { ...state, isFetching: false, isFailure: true, isLoaded: false, initialData: initialdata };
    case HEADER_INPUT_REMOVE:
      let removeData = _.cloneDeep(state.initialData);
      removeData.response.headers.income = removeData.response.headers.income.filter(x => x.id !== action.data.id);
      let incomeTotals = removeData.response.headers.incomeTotals.reduce((total, item) => {
        item.value = item.value - action.data[item.key].price
        total.push(item);
        return total
      }, [])
      removeData.response.headers.incomeTotals = incomeTotals

      return { ...state, isFetching: false, isFailure: true, isLoaded: false, initialData: removeData };
    case HEADER_INPUT_PERCENT:
      let percentArray = [];
      if (!_.isUndefined(state.percentArray)) {
        percentArray = percentArray.filter(x => x.id !== action.data.id);
      }
      percentArray.push({ id: action.data.id, value: action.data.value });
      return { ...state, isFetching: false, isFailure: false, isLoaded: true, percentArray: percentArray };
    case HEADER_INPUT_FAILURE:
      return { ...state, isFetching: false, isFailure: true, isLoaded: false, data: action.data };
    case HEADER_INPUT_EXCHANGE:
      return { ...state, isFetching: false, isFailure: true, isLoaded: false, exchange: action.data };
    case SET_EXCHANGE:
      return { ...state, convertedExchange: action.data };
    case HEADER_INPUT_LANG:
      return { ...state, lang: action.data };
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



// export default createReducer({
//   mapActionToKey: action => action.type,
//   types: [HEADER_INPUT_REQUEST, HEADER_INPUT_SUCCESS, HEADER_INPUT_FAILURE]
// });





