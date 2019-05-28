import { LOCALE_SET } from '../types';
import { localStorageData } from '../../utils/helper';




//action
export const setLocale = lang => dispatch => {
  localStorageData.delete('language');
  localStorageData.set('language', lang);
  dispatch({
    type: LOCALE_SET,
    lang,
  });
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
