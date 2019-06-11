import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    Typography,
    Paper,
    Link,
    Grid,
    Button,
    CssBaseline,
    RadioGroup,
    FormLabel,
    MenuItem,
    FormGroup,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormControlProps,
    InputLabel,
    InputAdornment,
    Switch
} from '@material-ui/core';
import { FormattedMessage, injectIntl } from "react-intl";
import { currencyType } from '../utils/helper';
import moment from 'moment';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator/lib/index';
import NumberFormat from 'react-number-format';
import Dialog from '@material-ui/core/Dialog';

import data from "../utils/staticData.json";
import { control } from "../utils/form";
import { saveTitle } from '../redux/modules/saveTitle';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Form, Field } from 'react-final-form';
import { TextField, Checkbox, Radio, } from 'final-form-material-ui';

import Creatable from 'react-select/creatable';
import Select from 'react-select';
import AutoComponentSelect from './common/AutoComponentSelect'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";

import "moment/locale/en-gb";
import "moment/locale/tr";

const validate = values => {
    const errors = {};
    if (!values.flowDirection) {
        errors.flowDirection = 'Reasdasdsquired';
    }
    if (!values.currency) {
        errors.currency = 'Required';
    }
    if (!values.ss) {
        errors.ss = 'Required';
    }
    return errors;
};

function DatePickerWrapper(props) {
    const {
        input: { name, onChange, value, ...restInput },
        meta,
        format1,
        ...rest
    } = props;
    const showError =
        ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
        meta.touched;
    debugger;
    return (
        <KeyboardDatePicker
            {...rest}
            name={name}
            format={format1}
            helperText={showError ? meta.error || meta.submitError : undefined}
            error={showError}
            inputProps={restInput}
            onChange={onChange}
            value={value === '' ? null : value}
        />
    );
}


const renderSelectField = ({
    input: { name, value, onChange, ...restInput },
    meta,
    label,
    options,
    formControlProps,
    ...rest
}) => {
    const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

    return (
        <FormControl fullWidth {...formControlProps} error={showError}>
            <InputLabel htmlFor={name}>{label}</InputLabel>

            <Select
                {...rest}
                fullWidth
                label={label}
                name={name}
                onChange={onChange}
                inputProps={restInput}
                value={value}
                options={options}
            />

            {showError &&
                <FormHelperText>{meta.error || meta.submitError}</FormHelperText>
            }
        </FormControl>
    )
}

const renderCreateSelectField = ({
    input: { name, value, onChange, ...restInput },
    meta,
    label,
    options,
    formControlProps,
    createOptionPosition,
    formatCreateLabel,
    onCreateOption,
    ...rest
}) => {
    const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;

    return (
        <FormControl fullWidth {...formControlProps} error={showError}>
            <InputLabel htmlFor={name}>{}</InputLabel>

            <Creatable
                {...rest}
                fullWidth
                label={label}
                name={name}
                createOptionPosition={createOptionPosition}
                formatCreateLabel={formatCreateLabel}
                onCreateOption={onCreateOption}
                onChange={onChange}
                inputProps={restInput}
                value={value}
                options={options}
            />

            {showError &&
                <FormHelperText>{meta.error || meta.submitError}</FormHelperText>
            }
        </FormControl>
    )
}

const dummyBasliklar = [
    { value: "12542685", label: "Banka Bakiyeleri", isDue: false },
    { value: "1254225", label: "Müşteri Tahsilatı", isDue: true },
    { value: "12542585", label: "Çek Tahsilatı", isDue: false },
    { value: "1256385", label: "Döviz Alış", isDue: true },
    { value: "12566685", label: "Tedarikçi Ödemesi", isDue: false },
    { value: "134685", label: "Maaş Ödemesi", isDue: false },
    { value: "126342685", label: "Kira Ödemesi", isDue: false },
    { value: "125412385", label: "Döviz Şatışı", isDue: false }
];


const flowDirections = [
    { value: '+', label: "Gelir (+)" },
    { value: '-', label: "Gider (-)" }
];


class ItemAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {

            flowDirection: "",
            flowDirectionTouch: false,
            flowDirectionError: false,
            currency: "",
            currencyTouch: false,
            currencyError: false,
            mainTitle: "",
            mainTitleTouch: false,
            mainTitleError: false,
            subTitle: "",
            dueDate: new Date(),
            amount: '',
            dueDateError: true,
            open: false,
            newTitle: '',
            isDue: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.dueDateErrorChangeState = this.dueDateErrorChangeState.bind(this);
        this.newMainTitle = this.newMainTitle.bind(this);
        this.handleOnClose = this.handleOnClose.bind(this);
        this.handleSaveAndClose = this.handleSaveAndClose.bind(this);
    }

    static getDerivedStateFromProps(nextProps) {
        const result = {};

        result.inputHeadersFetching = nextProps.title.isFetching;
        if (nextProps.title.isLoaded) {
            result.title = nextProps.title;


        }

        return { ...result };
    }

    handleSubmit = (values) => {

        debugger;
        if (!this.state.dueDateError) // hatalı
            alert("hatalıııı")
    }

    dueDateErrorChangeState(dueDateError) {
        this.setState({
            dueDateError: dueDateError
        });
    }

    handleFlowDirectionChange = (e) => {
        debugger;
    }

    handleMainTitleChange = (e) => {
        debugger;
    }

    handleCurrencyChange = (e) => {
        debugger;
    }

    newMainTitle(newData) {
        this.setState({
            open: true,
            newTitle: newData
        })
    }

    handleOnClose() {
        this.setState({
            open: false
        })
    }


    handleSaveAndClose(e) {
        console.log(e.target);
        this.props.saveTitle();


        this.setState({
            open: false
        })
    }

    render() {
        const { intl } = this.props;

        const currencies = Object.keys(data.currencies)
            .map(i => data.currencies[i])
            .reduce((columns, currency, i) => {
                columns.push({
                    value: currency.code,
                    label: `${currency.code} (${currency.symbol}) (${
                        intl.formatMessage({ id: currency.code })
                        })`
                });
                return columns;
            }, []);


        if (this.props.lang === 'en') {
            moment.locale("en-gb")
        } else {
            moment.locale("tr")
        }

        return (
            <>
                <div className="row mt-5">
                    <div className="col-sm-2" />
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleOnClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <ValidatorForm ref="form" onSubmit={this.handleSaveAndClose}>
                            <DialogTitle id="form-dialog-title">
                                <FormattedMessage id="itemAddModal.newMainTitle" />
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    <FormattedMessage id="itemAddModal.dueDateChooseDefinition" />
                                </DialogContentText>
                                <TextValidator
                                    autoFocus
                                    margin="dense"
                                    value={this.state.newTitle}
                                    label="Başlık"
                                    type="text"
                                    name="newTitle"
                                    fullWidth
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    {...control(this, "newTitle", (elements) => {
                                        return elements.target.value;
                                    })}
                                />
                                <label>Vade İlişkili mi ?</label>
                                <Switch
                                    color="primary"
                                    fullWidth
                                    {...control(this, "isDue")}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button type="submit" color="primary">
                                    <FormattedMessage id="addTitleModal.saveMainTitle" />
                                </Button>
                            </DialogActions>
                        </ValidatorForm>
                    </Dialog>
                    <div className="col-sm-push-2 col-sm-8">
                        <div className="card">
                            <Form
                                onSubmit={this.handleSubmit}
                                initialValues={{ employed: true, stooge: 'larry' }}
                                validate={validate}
                                render={({ handleSubmit, reset, submitting, pristine, values }) => (
                                    <form onSubmit={handleSubmit} noValidate>
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
                                                        label="Akış Yönü"
                                                        type="select"
                                                        name="flowDirection"
                                                        component={renderSelectField}
                                                        options={flowDirections}
                                                    />
                                                </div>
                                                <div className="col-sm-6">
                                                    <Field
                                                        label="Para birimi"
                                                        type="select"
                                                        name="currency"
                                                        component={renderSelectField}
                                                        options={currencies}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <Field
                                                        label="Başlık Seçimi"
                                                        type="select"
                                                        name="mainTitle"
                                                        component={renderCreateSelectField}
                                                        options={dummyBasliklar}
                                                        createOptionPosition="last"
                                                        formatCreateLabel={() => "Yeni başlık oluştur..."}
                                                        onCreateOption={this.newMainTitle}
                                                    />
                                                </div>

                                            </div>
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <Field
                                                        fullWidth
                                                        name="subTitle"
                                                        component={TextField}
                                                        type="text"
                                                        label="Alt Başlık"
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mt-5">
                                         
                                                    <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
                                                       
                                                    <Grid item xs={6}>
                                                         <Field
                                                            name="startDate"
                                                            component={DatePickerWrapper}
                                                            fullWidth
                                                            format1="DD/MM/YYYY"
                                                            margin="normal"
                                                            minDate={new Date()}
                                                            label={<FormattedMessage id="date.start" />}
                                                            value={this.state.startDate}
                                                            disabled={this.state.mainTitle.isDue}
                                                            emptyLabel={moment(new Date()).format('DD/MM/YYYY')}
                                                        />
                                                        </Grid>
                                                    </MuiPickersUtilsProvider>
                                                <Grid item xs={6}>
                                                    <Field
                                                        name="amount"
                                                        label="Tutar"
                                                        fullWidth
                                                        className="form-control"
                                                        component={TextField}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <span>{currencyType("TRY").symbol}</span>
                                                                </InputAdornment>
                                                            ),
                                                            inputComponent: NumberFormat,
                                                        }}
                                                    />
                                                  </Grid>
                                            </div>
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    disabled={submitting}
                                                >
                                                    Submit
                          </Button>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

ItemAddModal.propTypes = {
    saveTitle: PropTypes.func.isRequired,
};
ItemAddModal.defaultProps = {};

const mapStateToProps = state => ({
    title: state.title,
});
const mapDispatchToProps = {
    saveTitle,
};


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(ItemAddModal));