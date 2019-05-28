import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import Option from './Option';
import { connect } from 'react-redux';

import { currencyType, localeAmountPrice } from '../utils/helper';
import Popover from '@material-ui/core/Popover';


class Table extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleRequestOpen(e) {
    e.preventDefault();
    this.setState({
      open: !this.state.open,
      anchorEl: e.currentTarget,
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
      anchorEl: null,
    });
  };

  render() {
    return (<>
      <Popover
        open={this.state.open}
        anchorEl={this.state.anchorEl}
        onClose={this.handleRequestClose.bind(this)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Option id={"s"} lang={this.props.lang} />
      </Popover>
      <table className="table text-nowrap">
        <thead>
          <tr>
            <th style={{ width: "10px" }}>
              <FormattedMessage id="header.flowDirection" />
            </th>
            <th style={{ width: "10px" }}>
              <FormattedMessage id="header.title" />
            </th>
            {
              this.props.columns.map((item, i) =>
                <th key={i}>{item.label}</th> //<FormattedMessage id={`${item.value}`} />
              )
            }
            <th className="text-right">
              <i className="fas fa-info" onClick={this.handleRequestOpen.bind(this)}></i>
            </th>
          </tr>
        </thead>

        <tbody>
          {
            this.props.data.map((header, i) =>
              <tr key={i} className={header.flowDirectionSymbol === '+' ? 'table-success' : 'table-danger'}>
                <td>
                  <div>
                    <div>
                      <span className="text-default font-weight-semibold">
                        {header.flowDirectionExplanation}  {header.flowDirectionSymbol}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <h6 className="font-weight-semibold mb-0">
                    {header.title}
                  </h6>
                </td>
                {
                  this.props.columns.map((currency, i) =>
                    <td key={i}>
                      <h6 className="font-weight-semibold mb-0">
                        {currencyType(header.currencies.find(o => o.key === currency.value).key.toLocaleUpperCase()).symbol}{localeAmountPrice(header.currencies.find(o => o.key === currency.value).value)}
                      </h6>
                    </td>
                  )
                }
                <td className="text-right">
                  <i className="fas fa-info" onClick={this.handleRequestOpen.bind(this)}></i>
                </td>
              </tr>
            )
          }
          <tr>
            <td></td>
            <td></td>
            {
              this.props.columns.map((currency, i) =>
                <td key={i}>
                  <h6 className="font-weight-semibold mb-0">
                    <span className={`text-${this.props.totals.find(o => o.key === currency.value).value > 0 ? 'success' : 'danger'} font-size-xl font-weight-normal`}>
                      <i className={`icon-arrow-${this.props.totals.find(o => o.key === currency.value).value > 0 ? 'up12' : 'down12'}`}></i>
                      {currencyType(this.props.totals.find(o => o.key === currency.value).key.toLocaleUpperCase()).symbol}
                      {localeAmountPrice(this.props.totals.find(o => o.key === currency.value).value)}
                    </span>
                  </h6>
                </td>
              )
            }
            <td></td>
          </tr>
        </tbody>
      </table>
    </>
    )
  }

}

Table.propTypes = {
  lang: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  lang: state.locale.lang,
});

const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Table);




              {/* <Tooltip trigger="click"
                    theme='light'
                    arrow
                    interactive = {true}
                    useContext = {HeaderList}

                    animation = "scale"
                    animateFill = {false}
                    html={(
                          <Option id={"all"} lang={this.props.lang}/>
                    )}
                  >    
                    <i className="fas fa-info"></i>                    
                  </Tooltip> */}


                  
                  {/* <Tooltip trigger="click"
                    theme='light'
                    arrow
                    interactive = {true}
                    useContext = {HeaderList}
                    animation = "scale"
                    animateFill = {false}
                    html={(
                      <Option id={header.id} lang={this.props.lang}/>
                    )}
                  >    
                      <i className="fas fa-info"></i>
                  </Tooltip> */}