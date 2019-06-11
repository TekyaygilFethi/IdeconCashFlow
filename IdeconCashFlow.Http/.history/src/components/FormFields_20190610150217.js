import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { currencyType } from '../utils/helper';
import { InputAdornment, Select, Switch, Button, MenuItem, FormHelperText, InputLabel, FormControl, TextField } from "@material-ui/core/index";
import AutoComponentSelect from './common/AutoComponentSelect';
import CreatableSelect from "react-select/lib/Creatable";
import moment from 'moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import SelectField from '@material-ui/core/Select';

import "moment/locale/en-gb";
import "moment/locale/tr";

import { FormattedMessage, injectIntl } from "react-intl";

const validate = values => {
    const errors = {};
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'favoriteColor',
      'notes',
    ];
    requiredFields.forEach(field => {
      if (!values[field]) {
        errors[field] = 'Required';
      }
    });
    if (
      values.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }
    return errors;
  } 

  const renderTextField = (
    { input, label, meta: { touched, error }, ...custom },
  ) => (
    <TextField
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      {...custom}
    />
  );
  









const FormFields = props => {
    const {
        handleSubmit,
        flowDirectionsOptions,
        handleFlowDirectionChange
    } = props;
    return (
        <form onSubmit={handleSubmit}>
              <div>
        <Field
          name="firstName"
          component={renderTextField}
          label="First Name"
        />
      </div>
      <button type="submit">Submit</button>
        </form>
    );
};

FormFields.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    flowDirectionsOptions : PropTypes.array,
    handleFlowDirectionChange:PropTypes.func,
    currenciesOptions:PropTypes.array,
    handleCurrencyChange:PropTypes.func,
    mainTitleOptions:PropTypes.array,
    handleMainTitleChange:PropTypes.func,
    handleSubTitleChange:PropTypes.func
};
FormFields.defaultProps = {
};

const mapStateToProps = state => ({});
const mapDispatchToProps = {};


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    reduxForm({
        form: 'ItemAddModal',
        validate,
    })(FormFields),
);
