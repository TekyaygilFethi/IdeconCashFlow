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
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
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
    } = props;
    return (
        <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" component="input" type="text" value=""/>
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" component="input" type="text"/>
        </div>
        <button type="submit">Submit</button>
      </form>
    );
};

FormFields.propTypes = {
    handleSubmit: PropTypes.func.isRequired
};
FormFields.defaultProps = {
};

const mapStateToProps = state => ({});
const mapDispatchToProps = {};


export default reduxForm({
        form: 'ItemAddModal'
    })(FormFields);
