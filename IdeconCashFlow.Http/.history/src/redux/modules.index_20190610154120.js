import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer } from 'redux-form';

import locale from './modules/locale';
import inputHeaders from './modules/inputHeader';
import details from './modules/getDetail';
import title from './modules/saveTitle';

export default history => combineReducers({
    router: connectRouter(history),
    form: reducer,
    locale,
    inputHeaders,
    details,
    title
})