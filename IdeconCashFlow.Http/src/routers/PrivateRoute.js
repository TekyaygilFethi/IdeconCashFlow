import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { authControl } from '../utils/helper';

const PrivateRoute = ({ component: Component, ...rest }) => {

  const auth = authControl();

  return (
    <Route
      {...rest}
      render={props =>
        auth ? (
            <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login'
            }}
          />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
};
PrivateRoute.defaultProps = {
  location: { from: { pathname: '/' } },
};

const mapStateToProps = () => ({});
const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrivateRoute);
