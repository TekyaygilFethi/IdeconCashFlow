import React from 'react';
import PropTypes from 'prop-types';
import { PropagateLoader, BeatLoader } from 'react-spinners';
import logo from '../../assets/logo.png';
import { css } from '@emotion/core';


const Preloader = props => {
  const styles = {
    height: props.height,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  };

  return (
    <div style={{ ...styles, display: props.loading ? 'flex' : 'none' }}>
      {/* {props.message && <h3>{props.message}</h3>} */}
      <img style={{ width: 30 }} src={logo} alt="idecon" />
      <BeatLoader
        sizeUnit={"px"}
        size={10}
        color={'#254099'}
        loading={props.loading}
      />
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
  height: '250px',
};

export default Preloader;
