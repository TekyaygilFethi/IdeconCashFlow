import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import Layout from './Layout';

import { store } from '../../index';
import { setLocale } from '../../redux/modules/locale';
import { getExchange } from '../../redux/modules/getExchange';


import { detectLang, authControl } from '../../utils/helper';
import HeaderList from '../../pages/HeaderList';
import Detail from '../../pages/Detail';
import Login from '../../pages/Login';
import Items from '../../pages/Items';
import Page404 from '../../pages/Page404';
import PrivateRoute from '../../routers/PrivateRoute'
import PublicRoute from '../../routers/PublicRoute'


class MainLayout extends Component {
  constructor(props) {
    super(props);
    store.dispatch(getExchange());
    const lang = detectLang();
    store.dispatch(setLocale(lang));
  }

  render() {
    return (
      <>
        {
          authControl() && (
            <TopNavigation />
          )
        }
        <Layout>
          <Switch>
            <PrivateRoute exact path="/" name="Home Page" component={HeaderList} />
            <PrivateRoute path="/detail/:id/:startDate/:viewType" name="Detail" component={Detail} />
            <PublicRoute path="/login" name="Login" component={Login} />
            <PublicRoute path="/item/:id" name="Items" component={Items} />

            <PrivateRoute path="/404" component={Page404} />
            <Redirect to="/404" />
          </Switch>
        </Layout>
      </>
    );
  }
}

export default MainLayout;