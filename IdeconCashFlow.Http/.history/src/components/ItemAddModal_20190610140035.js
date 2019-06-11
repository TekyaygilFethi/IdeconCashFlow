import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { InputAdornment, Select, Switch, Button ,SelectField,MenuItem,FormHelperText,InputLabel,FormControl} from "@material-ui/core/index";
import { FormattedMessage, injectIntl } from "react-intl";

import moment from 'moment';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator/lib/index';

import Dialog from '@material-ui/core/Dialog';

import data from "../utils/staticData.json";
import { control } from "../utils/form";
import { saveTitle } from '../redux/modules/saveTitle';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Field, reduxForm } from 'redux-form';
import FormField from './FormFields';


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

    }

    handleMainTitleChange = (e) => {

    }

    handleCurrencyChange = (e) => {

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
        const { currency, flowDirection } = this.state;

       
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
                            <FormField 
                                onSubmit={this.handleSubmit}
                                flowDirectionsOptions= {flowDirections}
                                handleFlowDirectionChange= {this.handleFlowDirectionChange}
                                currenciesOptions= {currencies}
                                handleCurrencyChange= {this.handleCurrencyChange}
                                mainTitleOptions= {dummyBasliklar}
                                handleMainTitleChange= {this.handleMainTitleChange}
                                handleSubTitleChange= {this.handleSubTitleChange}
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
)(
    reduxForm({
      form: 'ItemAddModal',
      validate,
    })(injectIntl(ItemAddModal))
);


