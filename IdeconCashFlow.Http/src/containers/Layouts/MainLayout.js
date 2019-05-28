import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import Layout from './Layout';

import { store } from '../../index';
import { setLocale } from '../../redux/modules/locale';


import { detectLang } from '../../utils/helper';
import HeaderList from '../../pages/HeaderList';
import Detail from '../../pages/Detail';

class MainLayout extends Component {
    constructor(props) {
      super(props);
  
      const lang = detectLang();
      store.dispatch(setLocale(lang));
    }
  
    render() {
      return (
        <>
          <TopNavigation />
          <Layout>
            <Switch>
              <Route exact path="/" name="Home Page" component={HeaderList} />  
              <Route  path="/detail/:id/:startDate/:viewType" name="Detail" component={Detail} />  
            </Switch>
          </Layout>
        </>
      );
    }
  }
  
  export default MainLayout;