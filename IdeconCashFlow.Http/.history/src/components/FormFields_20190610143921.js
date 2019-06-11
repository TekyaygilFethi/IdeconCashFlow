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
    const errors = {}
    const requiredFields = [
      'favoriteColor',
      'flowDirection',
    ]
    requiredFields.forEach(field => {
      if (!values[field]) {
        errors[field] = 'Required'
      }
    })
   
    return errors
  }

  const renderSelectField = (
    { input, label, meta: { touched, error }, children, ...custom },
  ) => (
    <SelectField
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      onChange={(event, index, value) => input.onChange(value)}
      children={children}
      {...custom}
    />
  );
  

const renderSelectFiel1d = ({
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
            <AutoComponentSelect
                errorText={touched && error}
                handleChange={handleChange}
                children={children}
                options={options}
                value={value}
                required={required}
            />
        </>
    )

const renderTextField = ({
    input,
    label,
    meta: { touched, error },
    ...custom
}) => (
        <TextField
            hintText={label}
            floatingLabelText={label}
            errorText={touched && error}
            {...input}
            {...custom}
        />
    )


const FormFields = props => {
    const {
        handleSubmit,
        pristine,
        reset,
        submitting,
        flowDirectionsOptions,
        handleFlowDirectionChange,
        currenciesOptions,
        handleCurrencyChange,
        mainTitleOptions,
        handleMainTitleChange,
        handleSubTitleChange,

    } = props;
    return (
        <form onSubmit={handleSubmit}>
            <div className="card-header header-elements-inline">
                <h6 className="card-title">Custom background</h6>
                <div className="header-elements">
                    <div className="list-icons">
                        <i className="fas fa-eraser" />
                    </div>
                </div>
            </div>

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
                    <div className="col-sm-6">
                        <Field
                            required={true}
                            name="currency"
                            component={renderSelectField}
                            label="Para birimi"
                            options={currenciesOptions}
                            handleChange={handleCurrencyChange}
                        />
                         <Field
                         required
          name="favoriteColor"
          component={renderSelectField}
          label="Favorite Color"
        >
          <MenuItem value="ff0000" primaryText="Red" />
          <MenuItem value="00ff00" primaryText="Green" />
          <MenuItem value="0000ff" primaryText="Blue" />
        </Field>
                    </div>
                </div>

                <div className="form-group">
                    <label>Başlık Seçimi:</label>
                    {/* <CreatableSelect
                        name="mainTitle"
                        placeholder="Seçim yapınız"
                        options={mainTitleOptions}
                        createOptionPosition="last"
                        formatCreateLabel={() => "Yeni başlık oluştur..."}
                        onCreateOption={this.newMainTitle}
                        onChange={handleMainTitleChange}
                    /> */}
                </div>
                <div className="form-group">
                    <Field
                        name="subTitle"
                        required
                        component={renderTextField}
                        label="Alt Başlık"
                        handleChange={handleSubTitleChange}
                    />
                </div>


                <div className="row mt-5">
                    <div className="col-sm-6">
                        {/* <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} >
                            <KeyboardDatePicker
                                format="DD/MM/YYYY"
                                name="startDate"
                                minDate={new Date()}
                                label={<FormattedMessage id="date.start" />}
                                value={this.state.startDate}
                                disabled={this.state.mainTitle.isDue}
                                onChange={this.handleChange}
                                invalidDateMessage='uygunsuz'
                                minDateMessage='asdas'
                                invalidLabel="gatalı"
                                emptyLabel={moment(new Date()).format('DD/MM/YYYY')}
                            />
                        </MuiPickersUtilsProvider> */}
                    </div>
                    <div className="col-sm-6">

                        {/* <TextValidator
                                            name="amount"
                                            label="Tutar"
                                            className="form-control"
                                            {...control(this, "amount", (e) => {
                                                return e.target.value;
                                            })}
                                            validators={['required']}
                                            errorMessages={['this field is required']}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <span>{currencyType(currency.value).symbol}</span>
                                                    </InputAdornment>
                                                ),
                                                inputComponent: NumberFormat,
                                            }}
                                        /> */}
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


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(
    reduxForm({
        form: 'ItemAddModal',
        validate,
    })(FormFields),
);