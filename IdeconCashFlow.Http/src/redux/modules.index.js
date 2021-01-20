import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { reducer as forms } from 'redux-form';

import locale from './modules/locale';
import inputHeaders from './modules/inputHeader';
import outputHeaders from './modules/outputHeader';
import mainHeaderTotals from './modules/mainHeaderTotals';
import itemOfHeaders from './modules/getItemOfHeader';
import itemForDate from './modules/getItemForDate';
import itemAllOfHeaders from './modules/getIAlltemOfHeader';
import items from './modules/getItems';
import details from './modules/getDetail';
import mainHeaders from './modules/getMainHeader';
import title from './modules/saveTitle';
import item from './modules/saveItem';
import deletedItemResult from './modules/deleteItems';
import exchanges from './modules/getExchange';
import { authorization, loggedUser } from './modules/login';
import { columns } from './modules/showTableColumn';

export default history => combineReducers({
    router: connectRouter(history),
    form: forms,
    locale,
    inputHeaders,
    outputHeaders,
    mainHeaderTotals: mainHeaderTotals,
    details,
    title,
    item,
    auth: authorization,
    loggedUser,
    mainHeaders,
    exchanges,
    columns,
    itemOfHeaders,
    items,
    itemAllOfHeaders,
    itemForDate,
    deletedItemResult
})