import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, InputAdornment, Switch } from '@material-ui/core';
import { FormattedMessage, injectIntl } from "react-intl";
import { currencyType } from '../utils/helper';
import moment from 'moment';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator/lib/index';
import NumberFormat from 'react-number-format';
import Dialog from '@material-ui/core/Dialog';

import data from "../utils/staticData.json";
import { control } from "../utils/form";
import { saveTitle } from '../redux/modules/saveTitle';
import { saveItem } from '../redux/modules/saveItem';
import { getMainHeaders } from '../redux/modules/getMainHeader';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';

import BlockUi from 'react-block-ui';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import Slide from '@material-ui/core/Slide';



import { getInputHeaders } from '../redux/modules/inputHeader';
import { getOutputHeaders } from '../redux/modules/outputHeader';

import "moment/locale/en-gb";
import "moment/locale/tr";

import { DatePickerWrapperOnly, renderCreateSelectField, renderSelectField } from './common/ValidateForm';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const validate = values => {
    const errors = {};
    if (!values.flowDirection) {
        errors.flowDirection = <FormattedMessage id="error.flowDirection" />;
    }
    if (!values.currency) {
        errors.currency = <FormattedMessage id="error.currency" />;
    }
    if (!values.mainTitle) {
        errors.mainTitle = <FormattedMessage id="error.mainTitle" />;
    }
    if (!values.subTitleEN) {
        errors.subTitleEN = <FormattedMessage id="error.subTitleEN" />;
    }
    if (!values.subTitleTR) {
        errors.subTitleTR = <FormattedMessage id="error.subTitleTR" />;
    }
    if (!values.startDate) {
        errors.startDate = <FormattedMessage id="error.startDate" />;
    }
    if (moment(values.startDate, "DD/MM/YYYY").isValid() === false) {
        errors.startDate = <FormattedMessage id="error.startDate1" />;
    }
    if (!values.amount) {
        errors.amount = <FormattedMessage id="error.amount" />;
    }
    return errors;
};


const flowDirections = [
    { value: '+', label: <FormattedMessage id="header.incomeExplanation" /> },
    { value: '-', label: <FormattedMessage id="header.outcomeExplanation" /> }
];


class ItemAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {

            flowDirection: "",
            currency: "",
            mainTitles: "",
            mainTitle: {},
            mainTitleLoading: false,
            subTitleEN: "",
            subTitleTR: "",
            dueDate: "",
            amount: '',
            dueDateError: true,
            open: false,
            newTitleTR: '',
            newTitleEN: '',
            isDue: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.newMainTitle = this.newMainTitle.bind(this);
        this.handleOnClose = this.handleOnClose.bind(this);
        this.handleSaveAndClose = this.handleSaveAndClose.bind(this);
        this.handleMainTitleChange = this.handleMainTitleChange.bind(this);
        this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    }

    componentDidMount() {
        this.props.getMainHeaders();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const result = {};

        result.newMainTitleLoading = nextProps.title.isFetching;
        if (nextProps.title.isLoaded) {

        }

        result.mainTitleLoading = nextProps.mainHeaders.isFetching;


        if (nextProps.mainHeaders.isLoaded) {
            result.mainTitles = nextProps.mainHeaders.data.response.reduce((total, item, i) => {
                total.push({ value: item.value, label: (nextProps.lang === "tr" ? item.TurkishLabel : item.EnglishLabel) })
                return total;
            }, []);
        }

        result.itemLoading = nextProps.item.isFetching;
        if (nextProps.item.isLoaded) {
            nextProps.onClose('close');
        }

        return { ...result };
    }

    componentDidUpdate(prevProps, state) {

        if (prevProps.title !== this.props.title) {
            if (this.props.title.isLoaded) {
                let mainTitles = state.mainTitles;
                mainTitles.push(this.props.title.data.response);
                this.setState({
                    mainTitles,
                    mainTitle: this.props.title.data.response
                });
            }
        }

        if (prevProps.item !== this.props.item) {
            if (this.props.item.isLoaded) {
                if (this.state.flowDirection === "+") {
                    this.props.getInputHeaders({ page: 1, rowsPerPage: 5 });

                } else {
                    this.props.getOutputHeaders({ page: 1, rowsPerPage: 5 });
                }
            }
        }


    }

    handleSubmit = e => {

        this.props.saveItem(
            {
                "flowDirection": e.flowDirection.value,
                "currencyCode": e.currency.value,
                "mainHeaderID": e.mainTitle.value,
                "TurkishExplanation": e.subTitleTR,
                "EnglishExplanation": e.subTitleEN,
                "startDate": e.startDate,
                "amount": e.amount
            });
        this.setState({
            flowDirection: e.flowDirection.value
        })

    }

    handleCurrencyChange = e => { this.setState({ currency: e }); }
    handleMainTitleChange = e => { this.setState({ mainTitle: e }); }

    newMainTitle(newData) {

        if (this.props.lang === "tr") {
            this.setState({
                open: true,
                newTitleTR: newData,
                newTitleEN: '',
            })
        } else {
            this.setState({
                open: true,
                newTitleEN: newData,
                newTitleTR: ''
            })
        }


    }

    handleOnClose() {
        this.setState({
            open: false
        })
    }


    handleSaveAndClose(e) {
        this.props.saveTitle({ "TurkishTitle": this.state.newTitleTR, 'EnglishTitle': this.state.newTitleEN, 'isVadeIliskili': this.state.isDue });
        this.handleOnClose();
    }

    render() {
        const { intl } = this.props;
        const { mainTitles, mainTitleLoading } = this.state;

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
                <div className="row mt-5 mlr-0">
                    <div className="col-sm-2" />
                    <Dialog
                        open={this.state.open}
                        TransitionComponent={Transition}
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
                                    value={this.state.newTitleTR}
                                    label="Türkçe Başlık"
                                    type="text"
                                    name="newTitleTR"
                                    fullWidth
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    {...control(this, "newTitleTR", (elements) => {
                                        return elements.target.value;
                                    })}
                                />
                                <TextValidator
                                    margin="dense"
                                    value={this.state.newTitleEN}
                                    label="English Başlık"
                                    type="text"
                                    name="newTitleEN"
                                    fullWidth
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    {...control(this, "newTitleEN", (elements) => {
                                        return elements.target.value;
                                    })}
                                />
                                <label>Vade İlişkili mi ?</label>
                                <Switch
                                    color="primary"
                                    fullWidth
                                    {...control(this, "isDue", (elements, asd) => {
                                        return !elements.target.value;
                                    })}
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
                        <BlockUi blocking={this.state.itemLoading} tag="div" className="card">
                            <Form
                                ref="user-from"
                                onSubmit={this.handleSubmit}
                                validate={validate}
                                render={({ handleSubmit, reset, submitting, pristine, values }) => (
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="card-header header-elements-inline">
                                            <h6 className="card-title"></h6>
                                            <div className="header-elements">
                                                <div className="list-icons">
                                                    <i className="fas fa-eraser" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-body">
                                            <div className="row mt-3">
                                                <div className="col-sm-6">
                                                    <Field
                                                        placeholder=''
                                                        label={<FormattedMessage id="item.flowdirection" />}
                                                        type="select"
                                                        name="flowDirection"
                                                        placeholder={<FormattedMessage id="header.choose" />}
                                                        component={renderSelectField}
                                                        options={flowDirections}
                                                    />
                                                </div>
                                                <div className="col-sm-6">
                                                    <Field
                                                        label={<FormattedMessage id="item.currency" />}
                                                        type="select"
                                                        name="currency"
                                                        placeholder={<FormattedMessage id="header.choose" />}
                                                        onChangeInput={this.handleCurrencyChange}
                                                        component={renderSelectField}
                                                        options={currencies}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <BlockUi tag="form" blocking={mainTitleLoading} className="col-sm-12">
                                                    <Field
                                                        label={<FormattedMessage id="item.maintitle" />}
                                                        type="select"
                                                        name="mainTitle"
                                                        component={renderCreateSelectField}
                                                        options={mainTitles}
                                                        createOptionPosition="last"
                                                        placeholder={<FormattedMessage id="header.choose" />}
                                                        formatCreateLabel={() => <FormattedMessage id="item.newmaintitle" />}
                                                        onCreateOption={this.newMainTitle}
                                                        onChangeInput={this.handleMainTitleChange}
                                                        inputValue={this.state.mainTitle}
                                                    />
                                                </BlockUi>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-sm-6">
                                                    <Field
                                                        fullWidth
                                                        name="subTitleTR"
                                                        component={TextField}
                                                        type="text"
                                                        label={<FormattedMessage id="item.undertitleTR" />}
                                                    />
                                                </div>
                                                <div className="col-sm-6">
                                                    <Field
                                                        fullWidth
                                                        name="subTitleEN"
                                                        component={TextField}
                                                        type="text"
                                                        label={<FormattedMessage id="item.undertitleEN" />}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
                                                    <div className="col-sm-6 form-group">
                                                        <Field
                                                            name="startDate"
                                                            component={DatePickerWrapperOnly}
                                                            fullWidth
                                                            label={<FormattedMessage id="date.start" />}
                                                            format1="DD/MM/YYYY"
                                                            disabled={this.state.mainTitle.isDue}
                                                        />
                                                    </div>
                                                </MuiPickersUtilsProvider>

                                                <div className="col-sm-6 form-group">
                                                    <Field
                                                        name="amount"
                                                        label={<FormattedMessage id="item.amount" />}
                                                        fullWidth
                                                        component={TextField}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <span>{currencyType(this.state.currency.value).symbol}</span>
                                                                </InputAdornment>
                                                            ),
                                                            inputComponent: NumberFormat,
                                                        }}
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
                                                <FormattedMessage id="item.save" /> <i className="icon-paperplane ml-2" />
                                            </button>
                                        </div>
                                    </form>
                                )}
                            />
                        </BlockUi>
                    </div>
                </div>
            </>
        );
    }
}

ItemAddModal.propTypes = {
    lang: PropTypes.string.isRequired,
    saveTitle: PropTypes.func.isRequired,
    saveItem: PropTypes.func.isRequired,
    getInputHeaders: PropTypes.func.isRequired,
    getOutputHeaders: PropTypes.func.isRequired,
};

ItemAddModal.defaultProps = {};

const mapStateToProps = state => ({
    lang: state.locale.lang,
    title: state.title,
    item: state.item,
    mainHeaders: state.mainHeaders,
    inputHeaders: state.inputHeaders,
});
const mapDispatchToProps = {
    saveTitle,
    getMainHeaders,
    saveItem,
    getInputHeaders,
    getOutputHeaders
};


export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(ItemAddModal));