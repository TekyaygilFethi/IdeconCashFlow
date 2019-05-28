import React, { Component } from 'react';
import { FormattedMessage } from "react-intl";
import moment from 'moment';

import {history} from '../index';
import {UncontrolledDropdown,DropdownToggle,DropdownMenu,DropdownItem,Form, FormGroup, Label, Input } from 'reactstrap';
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


const dateOptions = { "d": "date.option.day", "w": "date.option.week", "m": "date.option.month" };

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

    render() {
        const { dateChoose, startDate } = this.state;
        
        if(this.props.lang === 'en'){
            moment.locale("en-gb")
        }else{
            moment.locale("tr")
        }
        
        return (
                    <div className="row">
                            <div className="col-md-12">
								<div className="card">
									<div className="card-body">                                        
										<Form>
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
                                                <Grid container justify="space-around">
                                                    <KeyboardDatePicker
                                                    format="DD/MM/YYYY"
                                                    margin="normal"
                                                    label= {<FormattedMessage id="date.start" />}
                                                    value={this.state.startDate}
                                                    onChange={this.handleChange}
                                                    />
                                                </Grid>
                                            </MuiPickersUtilsProvider>
                                            <MuiPickersUtilsProvider utils={MomentUtils} libInstance={moment}>
                                                <Grid container justify="space-around">
                                                    <KeyboardDatePicker
                                                    margin="normal"
                                                    format="DD/MM/YYYY"
                                                    label= {<FormattedMessage id="date.end" />}
                                                    value={this.state.endDate}
                                                    disabled
                                                    />
                                                </Grid>
                                            </MuiPickersUtilsProvider>
                                            </FormGroup>
                               
                                        </Form>

										<div className="text-right">
                                        <Button variant="contained" size="medium" color="primary" onClick={()=>history.push(`/detail/${this.props.id}/${moment(startDate).format('DD-MM-YYYY')}/${dateChoose}`)} >
                                        <FormattedMessage id="button.detail" />
                                        </Button>
											{/* <button type="button" className="btn btn-primary" onClick={()=>history.push(`/detail/${this.props.id}/${moment(startDate).format('DD-MM-YYYY')}/${dateChoose}`)} > <FormattedMessage id="button.detail" /></button> */}
										</div>
									</div>
								</div>
							</div>
                    </div>    







        )
    }
}


// export default connect()(Option);

export default Option;





{/* <div className="form-group row">
<div className="col-sm-6">
<label> <FormattedMessage id="date.start" /></label>
<DatePicker
    dateFormat="dd/MM/yyyy"
    selected={this.state.startDate}
    onChange={this.handleChange}
    className="form-control"
/>
</div>
<div className="col-sm-6">
    <label><FormattedMessage id="date.end" /></label>                                                    
        <DatePicker
            dateFormat="dd/MM/yyyy"
            disabled
            selected={this.state.endDate}
            className="form-control"
        />
</div>										
</div> */}