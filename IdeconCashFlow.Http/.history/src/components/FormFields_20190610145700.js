import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { currencyType } from '../utils/helper';
import {
    AutoComplete,
    Checkbox,
    DatePicker,
    TimePicker,
    RadioButtonGroup,
    SelectField,
    Slider,
    TextField,
    Toggle,
  } from 'redux-form-material-ui';
import AutoComponentSelect from './common/AutoComponentSelect';
import CreatableSelect from "react-select/lib/Creatable";
import moment from 'moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";

import "moment/locale/en-gb";
import "moment/locale/tr";

import { FormattedMessage, injectIntl } from "react-intl";

const validate = values => {
    const errors = {}
    const requiredFields = [
      'flowDirection',
    ]
    requiredFields.forEach(field => {
      if (!values[field]) {
        errors[field] = 'Required'
      }
    })
   
    return errors
  }  

const renderSelectField = ({
    input,
    label,
    options,
    meta: { touched, error },
    children,
    value,
    required,
    handleChange,
    ...custom
}) => (
        <>
            <InputLabel>{label}</InputLabel>
            <TextField
                errorText={touched && error}
                handleChange={handleChange}
                children={children}
                options={options}
                value={value}
                required={required}
            />
        </>
    )

const FormFields = props => {
    const {
        handleSubmit,
        flowDirectionsOptions,
        handleFlowDirectionChange
    } = props;
    return (
        <form onSubmit={handleSubmit}>
            <div className="card-body">
                <div className="row">
                    <div className="col-sm-6">
                        <Field
                            name="flowDirection"
                            component={renderSelectField}
                            label="Akış Yönü"
                            options={flowDirectionsOptions}
                            handleChange={handleFlowDirectionChange}
                        />
                    </div>
                    </div>
                    </div>
            <div className="card-footer d-flex justify-content-between align-items-center bg-teal-400 border-top-0">
                <p className="legitRipple" />
                <button
                     type="submit"
                    className="btn btn-outline bg-white text-white border-white border-2 legitRipple"
                >
                    Kaydet <i className="icon-paperplane ml-2" />
                </button>
            </div>
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


export default
    reduxForm({
        form: 'ItemAddModal',
        validate,
    })(FormFields)
