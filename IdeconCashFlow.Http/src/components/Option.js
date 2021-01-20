import React, { Component } from 'react';
import { FormattedMessage } from "react-intl";
import moment from 'moment';

import { history } from '../index';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label, Input } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";

import "moment/locale/en-gb";
import "moment/locale/tr";

import { DatePickerWrapper } from './common/ValidateForm'
import { Form, Field } from 'react-final-form';


const dateOptions = { "d": "date.option.day", "w": "date.option.week", "m": "date.option.month" };


const validate = values => {
    const errors = {};
    if (!values.startDate) {
        errors.startDate = 'Lütfen başlangıç tarih alanını doldurunuz!';
    }
    return errors;
};

export class Option extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(moment()),
            dateChoose: 'd',
            endDate: new Date(moment().add('days', 15)),
            dateChooseDef: 'days'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(date) {
        this.setState({
            startDate: date,
            endDate: new Date(moment(date).add(this.state.dateChooseDef, 15)),
        });
    }

    changeValue(dateChoose) {
        let dateChooseDef = null;
        if (dateChoose === 'd') {
            dateChooseDef = 'days';
        } else if (dateChoose === 'w') {
            dateChooseDef = 'weeks';
        } else {
            dateChooseDef = 'months';
        }

        const endDate = new Date(moment(this.state.startDate).add(dateChooseDef, 15));
        this.setState({ dateChoose, endDate, dateChooseDef });
    }

    handleSubmit = e => {
        history.push(`/detail/${this.props.id}/${moment(e.startDate).format('YYYY-MM-DD')}/${this.state.dateChoose}`)
    }

    render() {
        const { dateChoose } = this.state;

        if (this.props.lang === 'en') {
            moment.locale("en-gb")
        } else {
            moment.locale("tr")
        }

        return (
            <div className="row ">
                <div className="col-md-12 flex">
                    <Form
                        onSubmit={this.handleSubmit}
                        validate={validate}
                        render={({ handleSubmit, reset, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="card p-2">
                                    <FormGroup>
                                        <UncontrolledDropdown setActiveFromChild>
                                            <DropdownToggle tag="a" className="nav-link" caret>
                                                <FormattedMessage id={`${dateOptions[dateChoose]}`} />
                                            </DropdownToggle>
                                            <DropdownMenu style={{ width: '10px' }}>
                                                <DropdownItem active={dateChoose === "d"} onClick={() => this.changeValue("d")} >
                                                    <FormattedMessage id="date.option.day" />
                                                </DropdownItem>
                                                <DropdownItem active={dateChoose === "w"} onClick={() => this.changeValue("w")} >
                                                    <FormattedMessage id="date.option.week" />
                                                </DropdownItem>
                                                <DropdownItem active={dateChoose === "m"} onClick={() => this.changeValue("m")} >
                                                    <FormattedMessage id="date.option.month" />
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </FormGroup>
                                    <FormGroup>
                                        <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} >
                                            <Field
                                                name="startDate"
                                                component={DatePickerWrapper}
                                                fullWidth
                                                inputValue={this.state.startDate}
                                                onChangeInput={this.handleChange}
                                                label={<FormattedMessage id="date.start" />}
                                                format1="DD/MM/YYYY"
                                            />
                                        </MuiPickersUtilsProvider>
                                    </FormGroup>
                                    <FormGroup>
                                        <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
                                            <Field
                                                name="endDate"
                                                component={DatePickerWrapper}
                                                fullWidth
                                                label={<FormattedMessage id="date.end" />}
                                                format1="DD/MM/YYYY"
                                                value={this.state.endDate}
                                                inputValue={this.state.endDate}
                                                disabled
                                            />
                                        </MuiPickersUtilsProvider>
                                    </FormGroup>

                                </div>
                                <div className="card-footer d-flex justify-content-between align-items-center bg-teal-400 border-top-0">
                                    <p className="legitRipple" />
                                    <button
                                        type="submit"
                                        className="btn btn-outline bg-white text-white border-white border-2 legitRipple"
                                    >
                                        <FormattedMessage id="button.detail" /> <i className="icon-paperplane ml-2" />
                                    </button>
                                </div>
                            </form>
                        )}
                    />
                </div>
            </div>







        )
    }
}


// export default connect()(Option);

export default Option;



// <Form>
//                                         <FormGroup>
//                                             <UncontrolledDropdown setActiveFromChild>
//                                                 <DropdownToggle tag="a" className="nav-link" caret>
//                                                     <FormattedMessage id={`${dateOptions[dateChoose]}`} />
//                                                 </DropdownToggle>
//                                                 <DropdownMenu style={{ width: '10px' }}>
//                                                     <DropdownItem active={dateChoose === "d"} onClick={() => this.changeValue("d")} >
//                                                         <FormattedMessage id="date.option.day" />
//                                                     </DropdownItem>
//                                                     <DropdownItem active={dateChoose === "w"} onClick={() => this.changeValue("w")} >
//                                                         <FormattedMessage id="date.option.week" />
//                                                     </DropdownItem>
//                                                     <DropdownItem active={dateChoose === "m"} onClick={() => this.changeValue("m")} >
//                                                         <FormattedMessage id="date.option.month" />
//                                                     </DropdownItem>
//                                                 </DropdownMenu>
//                                             </UncontrolledDropdown>
//                                             </FormGroup>
//                                             <FormGroup>
//                                             <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment} >
//                                                 <Grid container justify="space-around">
//                                                     <KeyboardDatePicker
//                                                     format="DD/MM/YYYY"
//                                                     margin="normal"
//                                                     label= {<FormattedMessage id="date.start" />}
//                                                     value={this.state.startDate}
//                                                     onChange={this.handleChange}
//                                                     />
//                                                 </Grid>
//                                             </MuiPickersUtilsProvider>
//                                             <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
//                                                 <Grid container justify="space-around">
//                                                     <KeyboardDatePicker
//                                                     margin="normal"
//                                                     format="DD/MM/YYYY"
//                                                     label= {<FormattedMessage id="date.end" />}
//                                                     value={this.state.endDate}
//                                                     disabled
//                                                     />
//                                                 </Grid>
//                                             </MuiPickersUtilsProvider>
//                                             </FormGroup>

//                                         </Form>

// 										<div className="text-right">
//                                         <Button variant="contained" size="medium" color="primary" onClick={()=>history.push(`/detail/${this.props.id}/${moment(startDate).format('DD-MM-YYYY')}/${dateChoose}`)} >
//                                         <FormattedMessage id="button.detail" />
//                                         </Button>
// 											{/* <button type="button" className="btn btn-primary" onClick={()=>history.push(`/detail/${this.props.id}/${moment(startDate).format('DD-MM-YYYY')}/${dateChoose}`)} > <FormattedMessage id="button.detail" /></button> */}
// 										</div>