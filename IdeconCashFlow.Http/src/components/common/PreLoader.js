import React from 'react';
import PropTypes from 'prop-types';
import { PropagateLoader,RiseLoader } from 'react-spinners';

const Preloader = props => {
  const styles = {
    height: props.height,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  };

  return (
    <div style={{ ...styles, display: props.loading ? 'flex' : 'none' }}>
      {props.message && <h3>{props.message}</h3>}
      İDECON LOGUSU
    </div>
  );
};

Preloader.propTypes = {
  loading: PropTypes.bool,
  message: PropTypes.string,
  height: PropTypes.string,
};
Preloader.defaultProps = {
  loading: false,
  message: null,
  height: '240px',
};

export default Preloader;
