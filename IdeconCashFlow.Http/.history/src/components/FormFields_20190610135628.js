import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { currencyType } from '../utils/helper';
import { InputAdornment, Select, Switch, Button, SelectField, MenuItem, FormHelperText, InputLabel, FormControl, TextField } from "@material-ui/core/index";
import AutoComponentSelect from './common/AutoComponentSelect';
import CreatableSelect from "react-select/lib/Creatable";
import moment from 'moment';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";

import "moment/locale/en-gb";
import "moment/locale/tr";

import { FormattedMessage, injectIntl } from "react-intl";

const validate = values => {
    const errors = {};

    if (!values.currency) {
        errors.currency = 'Lütfen bir adres girin!';

        return errors;
    };



}
const renderSelectField = ({
    input,
    label,
    options,
    meta: { touched, error },
    children,
    value,
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
                            name="currency"
                            component={renderSelectField}
                            label="Para birimi"
                            options={currenciesOptions}
                            handleChange={handleCurrencyChange}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Başlık Seçimi:</label>
                    <CreatableSelect
                        name="mainTitle"
                        placeholder="Seçim yapınız"
                        options={mainTitleOptions}
                        createOptionPosition="last"
                        formatCreateLabel={() => "Yeni başlık oluştur..."}
                        onCreateOption={this.newMainTitle}
                        onChange={handleMainTitleChange}
                    />
                </div>
                <div className="form-group">
                    <Field
                        name="subTitle"
                        component={renderTextField}
                        label="Alt Başlık"
                        handleChange={handleSubTitleChange}
                    />
                </div>


                <div className="row mt-5">
                    <div className="col-sm-6">
                        <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} >
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
                        </MuiPickersUtilsProvider>
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
    onSearch: PropTypes.func.isRequired,
    productsSelectedForReturn: PropTypes.arrayOf(PropTypes.any).isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    changeCount: PropTypes.func.isRequired,
    noSelectedProduct: PropTypes.string,
};
FormFields.defaultProps = {
    noSelectedProduct: null,
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
