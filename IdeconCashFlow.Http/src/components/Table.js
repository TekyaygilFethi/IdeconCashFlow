import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import Option from './Option';
import { connect } from 'react-redux';
import { IconButton } from '@material-ui/core/index';
import { Info, InfoOutlined, InfoRounded, InfoSharp, InfoTwoTone } from '@material-ui/icons/index';
import { currencyType, localeAmountPrice } from '../utils/helper';
import Popover from '@material-ui/core/Popover';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Convert from '../components/common/Convert';
import _ from 'lodash';

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

    const { data, convertExchange, columns, incomeTotals, outcomeTotals } = this.props;
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
        {
          this.state.anchorEl && (
            <Option id={this.state.anchorEl.id} lang={this.props.lang} />
          )
        }
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
              columns && (
                columns.map((item, i) =>
                  <th key={i}>{item.label}</th> //<FormattedMessage id={`${item.value}`} />
                )
              )
            }
            <th className="text-right">
              <IconButton size="small" onClick={this.handleRequestOpen.bind(this)} id="all">
                <InfoTwoTone fontSize="inherit" />
              </IconButton>
              {/* <i className="fas fa-info" onClick={this.handleRequestOpen.bind(this)}></i> */}
            </th>
          </tr>
        </thead>

        <tbody>
          {
            !_.isEmpty(data.income) && (
              data.income.map((header, i) =>
                <tr key={i} className={i % 2 === 0 ? 'income' : 'income-b'}>
                  <td>
                    <h6 className="font-weight-semibold mb-0">
                      {header.flowDirectionSymbol === "+" ? <FormattedMessage id="header.incomeExplanation" /> : <FormattedMessage id="header.outcomeExplanation" />}
                    </h6>
                  </td>
                  <td>
                    <h6 className="font-weight-semibold mb-0">
                      {header.title}
                    </h6>
                  </td>
                  {columns && (
                    columns.map((currency, i) =>
                      <td key={i}>
                        <h6 className="font-weight-semibold mb-0">
                          {currencyType(header.currencies.find(o => o.key === currency.value).key.toLocaleUpperCase()).symbol}
                          {localeAmountPrice(header.currencies.find(o => o.key === currency.value).value)}
                          {convertExchange !== undefined && convertExchange !== null && convertExchange.toLocaleUpperCase() !== currency.value.toLocaleUpperCase() ? (
                            <Convert
                              price={header.currencies.find(o => o.key === currency.value).value}
                              from={currency.value.toLocaleUpperCase()}
                              to={convertExchange} />
                          ) : (<></>)}

                        </h6>
                      </td>
                    )
                  )
                  }
                  <td className="text-right">
                    <IconButton size="small" onClick={this.handleRequestOpen.bind(this)} id={header.id}>
                      <InfoTwoTone fontSize="inherit" />
                    </IconButton>
                    {/* <i className="fas fa-info legitRipple" onClick={this.handleRequestOpen.bind(this)}></i> */}
                  </td>
                </tr>
              )
            )
          }
          {
            !_.isEmpty(data.income) && (
              <tr>
                <td></td>
                <td></td>
                {

                  columns && (
                    columns.map((currency, i) =>
                      <td key={i}>
                        <h6 className="mb-0">
                          {
                            !_.isEmpty(incomeTotals) && (

                              <span className={`text-${incomeTotals.find(o => o.key === currency.value).value > 0 ? 'success' : 'danger'} detailTotal`}>
                                <i className={`icon-arrow-${incomeTotals.find(o => o.key === currency.value).value > 0 ? 'up12' : 'down12'}`}></i>
                                {currencyType(incomeTotals.find(o => o.key === currency.value).key.toLocaleUpperCase()).symbol}
                                {localeAmountPrice(incomeTotals.find(o => o.key === currency.value).value)}

                                {convertExchange !== undefined && convertExchange !== null && convertExchange.toLocaleUpperCase() !== currency.value.toLocaleUpperCase() ? (
                                  <Convert
                                    price={incomeTotals.find(o => o.key === currency.value).value}
                                    from={currency.value.toLocaleUpperCase()}
                                    to={convertExchange} />
                                ) : (<></>)}
                              </span>
                            )
                          }

                        </h6>
                      </td>
                    )
                  )

                }
                <td></td>
              </tr>
            )}

          {
            !_.isEmpty(data.outcome) && (
              data.outcome.map((header, i) =>
                <tr key={i} className={i % 2 === 0 ? 'outcome' : 'outcome-b'}>
                  <td>
                    <h6 className="font-weight-semibold mb-0">
                      {header.flowDirectionSymbol === "+" ? <FormattedMessage id="header.incomeExplanation" /> : <FormattedMessage id="header.outcomeExplanation" />}

                    </h6>
                  </td>
                  <td>
                    <h6 className="font-weight-semibold mb-0">
                      {header.title}
                    </h6>
                  </td>
                  {this.props.columns && (
                    this.props.columns.map((currency, i) =>
                      <td key={i}>
                        <h6 className="font-weight-semibold mb-0">
                          {currencyType(header.currencies.find(o => o.key === currency.value).key.toLocaleUpperCase()).symbol}
                          {localeAmountPrice(header.currencies.find(o => o.key === currency.value).value)}
                          {convertExchange !== undefined && convertExchange !== null && convertExchange.toLocaleUpperCase() !== currency.value.toLocaleUpperCase() ? (
                            <Convert
                              price={header.currencies.find(o => o.key === currency.value).value}
                              from={currency.value.toLocaleUpperCase()}
                              to={convertExchange} />
                          ) : (<></>)}

                        </h6>
                      </td>
                    )
                  )
                  }
                  <td className="text-right">
                    <IconButton size="small" onClick={this.handleRequestOpen.bind(this)} id={header.id}>
                      <InfoTwoTone fontSize="inherit" />
                    </IconButton>
                    {/* <i className="fas fa-info legitRipple" onClick={this.handleRequestOpen.bind(this)}></i> */}
                  </td>
                </tr>
              )
            )
          }
          {
            !_.isEmpty(data.outcome) && (
              <tr>
                <td></td>
                <td></td>
                {

                  this.props.columns && (
                    this.props.columns.map((currency, i) =>
                      <td key={i}>
                        <h6 className="mb-0">
                          <span className={`text-${this.props.outcomeTotals.find(o => o.key === currency.value).value > 0 ? 'success' : 'danger'}  detailTotal`}>
                            <i className={`icon-arrow-${this.props.outcomeTotals.find(o => o.key === currency.value).value > 0 ? 'up12' : 'down12'}`}></i>
                            {currencyType(this.props.outcomeTotals.find(o => o.key === currency.value).key.toLocaleUpperCase()).symbol}
                            {localeAmountPrice(this.props.outcomeTotals.find(o => o.key === currency.value).value)}

                            {convertExchange !== undefined && convertExchange !== null && convertExchange.toLocaleUpperCase() !== currency.value.toLocaleUpperCase() ? (
                              <Convert
                                price={this.props.outcomeTotals.find(o => o.key === currency.value).value}
                                from={currency.value.toLocaleUpperCase()}
                                to={convertExchange} />
                            ) : (<></>)}
                          </span>
                        </h6>
                      </td>
                    )
                  )

                }
                <td></td>
              </tr>
            )}

          <tr className="table-active">
            <td colSpan="2" className="font-size-xl detailTotal">
              <FormattedMessage id="header.subtotal" />
            </td>
            {
              this.props.columns && (
                this.props.columns.map((currency, i) =>
                  <td key={i}>
                    <h5 className="mb-0">
                      <span className={`text-${this.props.totals.find(o => o.key === currency.value).value > 0 ? 'success' : 'danger'} font-size-xl detailTotal`}>
                        <i className={`icon-arrow-${this.props.totals.find(o => o.key === currency.value).value > 0 ? 'up12' : 'down12'}`}></i>
                        {currencyType(this.props.totals.find(o => o.key === currency.value).key.toLocaleUpperCase()).symbol}
                        {localeAmountPrice(this.props.totals.find(o => o.key === currency.value).value)}

                        {convertExchange !== undefined && convertExchange !== null && convertExchange.toLocaleUpperCase() !== currency.value.toLocaleUpperCase() ? (
                          <Convert
                            price={this.props.totals.find(o => o.key === currency.value).value}
                            from={currency.value.toLocaleUpperCase()}
                            to={convertExchange} />
                        ) : (<></>)}
                      </span>
                    </h5>
                  </td>
                )
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
const mapDispatchToProps = {
};

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
































                  // {
                  //   data.map((header, i) =>
                  //   {

                  //   }
                  //     <tr key={i} className={header.flowDirectionSymbol === '+' ? 'income' : 'outcome'}>
                  //       <td><h6 className="font-weight-semibold mb-0">
                  //         {header.flowDirectionExplanation}  {header.flowDirectionSymbol}</h6>
                  //       </td>
                  //       <td>
                  //         <h6 className="font-weight-semibold mb-0">
                  //           {header.title}
                  //         </h6>
                  //       </td>
                  //       {this.props.columns && (
                  //         this.props.columns.map((currency, i) =>
                  //           <td key={i}>
                  //             <h6 className="font-weight-semibold mb-0">
                  //               {currencyType(header.currencies.find(o => o.key === currency.value).key.toLocaleUpperCase()).symbol}{localeAmountPrice(header.currencies.find(o => o.key === currency.value).value)}
                  //             </h6>
                  //           </td>
                  //         )
                  //       )
                  //       }
                  //       <td className="text-right">
                  //         <IconButton size="small" onClick={this.handleRequestOpen.bind(this)}>
                  //           <InfoTwoTone fontSize="inherit" />
                  //         </IconButton>
                  //         {/* <i className="fas fa-info legitRipple" onClick={this.handleRequestOpen.bind(this)}></i> */}
                  //       </td>
                  //     </tr>
                  //   )
                  // }
                  // <tr>
                  //   <td></td>
                  //   <td></td>
                  //   {
                  //     this.props.columns && (
                  //       this.props.columns.map((currency, i) =>
                  //         <td key={i}>
                  //           <h6 className="font-weight-semibold mb-0">
                  //             <span className={`text-${this.props.totals.find(o => o.key === currency.value).value > 0 ? 'success' : 'danger'} font-size-xl font-weight-normal`}>
                  //               <i className={`icon-arrow-${this.props.totals.find(o => o.key === currency.value).value > 0 ? 'up12' : 'down12'}`}></i>
                  //               {currencyType(this.props.totals.find(o => o.key === currency.value).key.toLocaleUpperCase()).symbol}
                  //               {localeAmountPrice(this.props.totals.find(o => o.key === currency.value).value)}
                  //             </span>
                  //           </h6>
                  //         </td>
                  //       )
                  //     )
                  //   }
                  //   <td></td>
                  // </tr>