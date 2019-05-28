import React from 'react';
import PropTypes from 'prop-types';

const Flag = ({ name, squared }) => (
  <span
    className={`flag-icon flag-icon-${name === 'en' ? 'us' : name} ${squared &&
      'flag-icon-squared'}`}
  />
);

Flag.propTypes = {
  name: PropTypes.string.isRequired,
  squared: PropTypes.bool,
};
Flag.defaultProps = {
  squared: false,
};

export default Flag;
