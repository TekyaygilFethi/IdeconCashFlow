import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {InputAdornment,Select} from "@material-ui/core/index";
import CreatableSelect from "react-select/lib/Creatable";
import { FormattedMessage, injectIntl } from "react-intl";
import NumberFormat from 'react-number-format';
import { currencyType } from '../utils/helper';
import moment from 'moment';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator/lib/index';

import "moment/locale/en-gb";
import "moment/locale/tr";


import FormField from "../components/common/FormField";
import data from "../utils/staticData.json";
import { control } from "../utils/form";
import saveTitle from '../redux/modules/saveTitle';

const dummyBasliklar = [
    { value: "12542685", label: "Banka Bakiyeleri" },
    { value: "1254225", label: "Müşteri Tahsilatı" },
    { value: "12542585", label: "Çek Tahsilatı" },
    { value: "1256385", label: "Döviz Alış" },
    { value: "12566685", label: "Tedarikçi Ödemesi" },
    { value: "134685", label: "Maaş Ödemesi" },
    { value: "126342685", label: "Kira Ödemesi" },
    { value: "125412385", label: "Döviz Şatışı" }
];


const flowDirections = [
    { value: '+', label: "Gelir (+)" },
    { value: '-', label: "Gider (-)" }
];

const errorStyle = {
    control: (base, state) => ({
      ...base,
      '&:hover': { borderColor: 'red' }, // border style on hover
      border: '1px solid red', // default border color
      boxShadow: 'none', // no box-shadow
      // You can also use state.isFocused to conditionally style based on the focus state
    })
  };


class ItemAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
            flowDirection: "",
            flowDirectionTouch:false,
            flowDirectionError:false,
            currency:"",
            currencyTouch:false,
            currencyError:false,
            mainTitle: "",
            mainTitleTouch:false,
            mainTitleError:false,
            subTitle:"",
            dueDate:new Date(),
            amount:'',
            dueDateError:true
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.dueDateErrorChangeState = this.dueDateErrorChangeState.bind(this);
        this.newMainTitle = this.newMainTitle.bind(this);
    }


    static getDerivedStateFromProps(nextProps) {
        const result = {};

        return { ...result };
    }

    newMainTitle(newData) { 
        debugger;

        this.props.saveTitle();
    }

    handleSubmit = (values) => {


        if(!this.state.dueDateError) // hatalı
            alert("hatalıııı")
    }

    dueDateErrorChangeState(dueDateError){
        debugger;
        this.setState({
            dueDateError : dueDateError
        });
    }

    handleFlowDirectionChange = (e) => {
        debugger;
        if(!this.state.flowDirectionTouch)
            this.setState({flowDirectionTouch:true});

        if(e.value === ''){
            this.setState({
                flowDirectionError:true
            })
        }else{
            this.setState({
                flowDirectionError:false
            })
        }
    }

    handleMainTitleChange(){
        
    }

    handleCurrencyChange(){
        
    }



    render() {
        const { intl } = this.props;
        const {currency,flowDirection} = this.state;
        
        const currencies = Object.keys(data.currencies)
            .map(i => data.currencies[i])
            .reduce((columns, currency, i) => {
                columns.push({
                    value: currency.code,
                    label: `${currency.code} (${currency.symbol}) (${
                        intl.formatMessage({ id: currency.code})
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
                    <div className="col-sm-push-2 col-sm-8">
                        <div className="card">
                        <ValidatorForm ref="form" onSubmit={this.handleSubmit}>
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
                                        <label> Akış Yönü:</label>
                                        <div className="form-group has-error">
                                            <FormField
                                                type="select"
                                                styles={(this.state.flowDirectionTouch && this.state.flowDirectionError ? errorStyle:"") }
                                                name="flowDirection"
                                                options={flowDirections}
                                                {...control(this, "flowDirection",this.handleFlowDirectionChange)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <label>Para birimi</label>
                                        <FormField
                                            type="select"
                                            styles={(this.state.flowDirectionTouch && this.state.flowDirectionError ? errorStyle:"") }
                                            name="currency"
                                            options={currencies}
                                            {...control(this, "currency")}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Başlık Seçimi:</label>
                                    <CreatableSelect
                                        name="mainTitle"
                                        placeholder="Seçim yapınız"
                                        options={dummyBasliklar}
                                        createOptionPosition="first"
                                        formatCreateLabel={() => "Yeni başlık oluştur..."}
                                        onCreateOption={this.newMainTitle}
                                        {...control(this, "mainTitle")}
                                    />
                                </div>
                                <div className="form-group">
                                    <TextValidator
                                        label="Alt Başlık"
                                        name="subTitle"
                                        className="form-control"
                                        {...control(this, "subTitle",(e)=>{
                                            return e.target.value;
                                        })}
                                        validators={['required']}
                                        errorMessages={['this field is required']}
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
                                                    onChange={this.handleChange}
                                                    invalidDateMessage='uygunsuz'
                                                    minDateMessage='asdas'
                                                    invalidLabel="gatalı"
                                                    emptyLabel={moment(new Date()).format('DD/MM/YYYY')}
                                                    onError={()=>{
                                                        if(this.state.dueDateError)
                                                            this.dueDateErrorChangeState(false)
                                                    }}
                                                    onAccept={(e)=>{
                                                        if(!this.state.dueDateError)
                                                            this.dueDateErrorChangeState(true)
                                                    }}
                                                    {...control(this, "startDate")}
                                                />
                                        </MuiPickersUtilsProvider>
                                    </div>
                                    <div className="col-sm-6">

                                    <TextValidator
                                        name="amount"
                                        label="Tutar"
                                        className="form-control"
                                        {...control(this, "amount",(e)=>{
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
                            </ValidatorForm>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

ItemAddModal.propTypes = {
    saveTitle: PropTypes.func.isRequired
};
ItemAddModal.defaultProps = {};

const mapStateToProps = state => ({
    title: state.title
});
const mapDispatchToProps = {
    saveTitle
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(ItemAddModal));