import { HEADER_OUTPUT_REQUEST, HEADER_OUTPUT_SUCCESS, HEADER_OUTPUT_FAILURE, SET_EXCHANGE, HEADER_OUTPUT_EXCHANGE, HEADER_OUTPUT_PROCESS, HEADER_OUTPUT_LANG, HEADER_OUTPUT_ADD, HEADER_OUTPUT_REMOVE, HEADER_OUTPUT_PERCENT } from '../types';
import createDispatcher from '../../utils/createDispatcher';
import api from '../../api';
import _ from 'lodash';
import React from 'react';
import { currencyType, localeAmountPrice } from '../../utils/helper';
import { FormattedMessage } from "react-intl";





export function getOutputHeaders(data) {
  return (dispatch, getState) => {
    dispatch(createDispatcher(HEADER_OUTPUT_REQUEST, data));
    return api
      .outputHeaders(data)
      .then(res => {
        dispatch(createDispatcher(HEADER_OUTPUT_EXCHANGE, getState().exchanges));
        dispatch(createDispatcher(HEADER_OUTPUT_LANG, getState().locale.lang));
        dispatch(createDispatcher(HEADER_OUTPUT_SUCCESS, res.data));
        return res;
      }).catch(err => {
        dispatch(createDispatcher(HEADER_OUTPUT_FAILURE, err.response));
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
    case HEADER_OUTPUT_REQUEST:
      return { ...state, isFetching: true, isFailure: false, isLoaded: false, data: action.data };
    case HEADER_OUTPUT_SUCCESS:

      let columns = [];
      let outcomeArrayIds = [];
      let outcomeOptions = {};
      let newData = [];

      let firstData = _.cloneDeep(action.data);

      //Gösterilecek para birimlerinin listesini alıyorum
      columns = (firstData.response.headers.outcome[0].currencies).reduce((columns, currency, i) => {
        columns.push({
          value: currency.key,
          label: currency.key.toLocaleUpperCase() + " (" + currencyType(currency.key.toLocaleUpperCase()).symbol + ")",
        });
        return columns;
      }, []);

      if (!_.isUndefined(state.percentArray)) {

        state.percentArray.reduce((total, item, i) => {
          let outcomeIndex = firstData.response.headers.outcome.findIndex(x => x.id === item.id);
          if (outcomeIndex > -1) {
            firstData.response.headers.outcome[outcomeIndex].percent = item.value;

            if (item.value !== 0) {
              firstData.response.headers.outcome[outcomeIndex].currencies.reduce((ttl, currency, indx) => {
                let totalIndex = firstData.response.headers.outcomeTotals.findIndex(x => x.key === currency.key)
                firstData.response.headers.outcomeTotals[totalIndex].value = firstData.response.headers.outcomeTotals[totalIndex].value +
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
      outcomeArrayIds = (firstData.response.headers.outcome).reduce((columns, item, i) => {
        columns.push({ headerID: item.id, symbol: "-" })
        return columns;
      }, []);

      //Gelen masrafların ayalarını objeye çeviriyorum.
      outcomeOptions = {
        page: firstData.response.page,
        sizePerPage: firstData.response.sizePerPage,
        totalSize: firstData.response.totalSize
      }

      // Gelen masrafları tabloda gösterilmesi için ortak bir yapıya çeviriyorum.
      newData = firstData.response.headers.outcome.reduce((total, item, i) => {
        let currencyObj = columns.reduce((columnTotal, currency, j) => {
          let dataObj = {};

          if (!_.isEmpty(state.convertedExchange) && state.convertedExchange.value !== currency.value && !_.isEmpty(state.convertedExchange.value)) {
            dataObj.price = (exchange(state.exchange, state.convertedExchange.value, currency.value, Math.abs(item.currencies.find(o => o.key === currency.value).value)))
            dataObj.symbol = (state.convertedExchange.value)
          } else {
            dataObj.price = (Math.abs(item.currencies.find(o => o.key === currency.value).value))
            dataObj.symbol = (item.currencies.find(o => o.key === currency.value).key)
          }
          columnTotal[currency.value] = dataObj
          return columnTotal;
        }, {});

        currencyObj.key = item.id + i;
        currencyObj.flowDirection = "-"
        currencyObj.direction = <FormattedMessage id="header.outcomeExplanation" />;
        currencyObj.title = state.lang === 'tr' ? item.TurkishTitle : item.EnglishTitle
        currencyObj.id = item.id;
        currencyObj.detail = item.isSimilation
        currencyObj.percent = _.isUndefined(item.percent) ? 0 : item.percent
        total.push(currencyObj);
        return total;
      }, []);

      let outcomeTotalsData = _.cloneDeep(firstData.response.headers.outcomeTotals);
      if (!_.isEmpty(state.convertedExchange) && !_.isEmpty(state.convertedExchange.value)) {
        outcomeTotalsData = outcomeTotalsData.reduce((total, item) => {
          if (state.convertedExchange.value !== item.key) {
            item.value = (exchange(state.exchange, state.convertedExchange.value, item.key, Math.abs(item.value)))
          }
          item.symbol = state.convertedExchange.value
          total.push(item)
          return total;
        }, [])
      }

      //GRAFİK İÇİN
      let outTotalPieData = firstData.response.headers.outcomeTotals.reduce((total, item) => {
        total = total + exchange(state.exchange, "TRY", item.key, Math.abs(item.value))
        return total;
      }, 0)

      let outcomePieData = firstData.response.headers.outcome.reduce((total, content) => {
        let result = content.currencies.reduce((contentTotal, item, j) => {
          contentTotal = contentTotal + exchange(state.exchange, "TRY", item.key, Math.abs(item.value))
          return contentTotal;
        }, 0)
        total.push({ id: content.id, text: state.lang === "tr" ? content.TurkishTitle : content.EnglishTitle, value: result, color: '#ee3124' })
        return total;
      }, [])


      return {
        ...state, isFetching: false, isFailure: false, isLoaded: true,
        initialData: firstData, data: newData, outcome: firstData.response.headers.outcome,
        outcomeTotals: outcomeTotalsData, columns, outcomeArrayIds, outcomeOptions,
        outTotalPieData, outcomePieData
      };
    case HEADER_OUTPUT_PROCESS:
      let data = _.cloneDeep(state.initialData);
      let index = data.response.headers.outcome.findIndex(x => x.id === action.data.id)
      let currencyIndex = data.response.headers.outcome[index].currencies.findIndex((e) => e.key === action.data.currency)
      let dataIndex = data.response.headers.outcomeTotals.findIndex((e) => e.key === action.data.currency);

      // kur çevirimi varsa o kur çevirimim üzerinden para ekliyor o yüzden çevrim yapılması lazım
      if (!_.isEmpty(state.convertedExchange) && state.convertedExchange.value !== action.data.currency) {
        action.data.value = exchange(state.exchange, action.data.currency, state.convertedExchange.value, parseFloat(action.data.value))
      }

      data.response.headers.outcomeTotals[dataIndex].value = data.response.headers.outcomeTotals[dataIndex].value - (Math.abs(data.response.headers.outcome[index].currencies[currencyIndex].value) - action.data.value)
      data.response.headers.outcome[index].currencies[currencyIndex].value = parseFloat(action.data.value)
      return { ...state, isFetching: false, isFailure: false, isLoaded: true, outcome: data, initialData: data };
    case HEADER_OUTPUT_ADD:
      let initialdata = _.cloneDeep(state.initialData);
      initialdata.response.headers.outcome.push(action.data);
      return { ...state, isFetching: false, isFailure: true, isLoaded: false, initialData: initialdata };
    case HEADER_OUTPUT_REMOVE:
      let removeData = _.cloneDeep(state.initialData);
      removeData.response.headers.outcome = removeData.response.headers.outcome.filter(x => x.id !== action.data.id);
      let outcomeTotals = removeData.response.headers.outcomeTotals.reduce((total, item) => {
        item.value = item.value + action.data[item.key].price
        total.push(item);
        return total
      }, [])
      removeData.response.headers.outcomeTotals = outcomeTotals
      return { ...state, isFetching: false, isFailure: true, isLoaded: false, initialData: removeData };
    case HEADER_OUTPUT_PERCENT:
      let percentArray = [];
      if (!_.isUndefined(state.percentArray)) {
        percentArray = percentArray.filter(x => x.id !== action.data.id);
      }
      percentArray.push({ id: action.data.id, value: action.data.value });
      return { ...state, isFetching: false, isFailure: false, isLoaded: true, percentArray: percentArray };
    case HEADER_OUTPUT_FAILURE:
      return { ...state, isFetching: false, isFailure: true, isLoaded: false, data: action.data };
    case HEADER_OUTPUT_EXCHANGE:
      return { ...state, isFetching: false, isFailure: true, isLoaded: false, exchange: action.data };
    case SET_EXCHANGE:
      return { ...state, convertedExchange: action.data };
    case HEADER_OUTPUT_LANG:
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