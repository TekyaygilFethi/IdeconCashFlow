import { LOCALE_SET, HEADER_INPUT_SUCCESS, HEADER_INPUT_LANG, HEADER_OUTPUT_SUCCESS, HEADER_OUTPUT_LANG } from '../types';
import { localStorageData } from '../../utils/helper';
import createDispatcher from '../../utils/createDispatcher'
import setLocaleHeader from '../../utils/setLocaleHeader';
import _ from 'lodash';


//action
export const setLocale = lang => (dispatch, getState) => {
  setLocaleHeader(lang)
  localStorageData.delete('language');
  localStorageData.set('language', lang);
  dispatch({
    type: LOCALE_SET,
    lang,
  });
  dispatch(createDispatcher(HEADER_INPUT_LANG, getState().locale.lang));
  dispatch(createDispatcher(HEADER_OUTPUT_LANG, getState().locale.lang));

  if (!_.isUndefined(getState().outputHeaders.initialData)) {
    dispatch(createDispatcher(HEADER_OUTPUT_SUCCESS, getState().outputHeaders.initialData));
  }
  if (!_.isUndefined(getState().outputHeaders.initialData)) {
    dispatch(createDispatcher(HEADER_INPUT_SUCCESS, getState().inputHeaders.initialData));
  }
};


//reducer
export default function locale(state = { lang: 'tr' }, action = {}) {
  switch (action.type) {
    case LOCALE_SET:
      return action;
    default:
      return state;
  }
}
