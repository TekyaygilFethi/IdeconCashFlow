import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import Option from './Option';
import { connect } from 'react-redux';
import { IconButton, Table, TableBody, TableCell, TableHead, TableFooter, TablePagination, TableRow, } from '@material-ui/core/index';
import { InfoTwoTone } from '@material-ui/icons/index';
import { currencyType, localeAmountPrice } from '../utils/helper';
import Popover from '@material-ui/core/Popover';
import Convert from '../components/common/Convert';
import _ from 'lodash';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';

const useStyles1 = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing(2.5),
    },
}));

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    function handleFirstPageButtonClick(event) {
        onChangePage(0, +rowsPerPage);
    }

    function handleBackButtonClick(event) {
        onChangePage(page - 1, +rowsPerPage);
    }

    function handleNextButtonClick(event) {
        onChangePage(page + 1, +rowsPerPage);
    }

    function handleLastPageButtonClick(event) {
        onChangePage(Math.max(0, Math.ceil(count / +rowsPerPage) - 1), rowsPerPage);
    }

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="First Page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / (rowsPerPage * 2)) - 1}
                aria-label="Next Page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / (rowsPerPage * 2)) - 1}
                aria-label="Last Page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};


class NewTable extends Component {
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

        const prefixColumns = [
            { dataField: 'direction', text: <FormattedMessage id="header.flowDirection" /> },
            { dataField: 'title', text: <FormattedMessage id="header.title" /> }
        ]

        let newIncomeColumns = columns.reduce((total, item, i) => {
            let symbol = '';
            let price = '';

            if (!_.isEmpty(data.income)) {
                symbol = currencyType(incomeTotals.find(o => o.key === item.value).key.toLocaleUpperCase()).symbol;

                if (convertExchange !== undefined && convertExchange !== null && convertExchange.toLocaleUpperCase() !== item.value.toLocaleUpperCase()) {
                    price = <Convert price={incomeTotals.find(o => o.key === item.value).value} from={item.value.toLocaleUpperCase()} to={convertExchange} />
                }

                price = localeAmountPrice(incomeTotals.find(o => o.key === item.value).value)
            }

            total.push({
                dataField: item.value,
                text: item.label,
                footer: symbol + price
            })

            return total;
        }, []);

        //Birleştirdim 2 tabloyu
        newIncomeColumns = prefixColumns.concat(newIncomeColumns);


        let newOutcomeColumns = columns.reduce((total, item, i) => {
            let symbol = '';
            let price = '';

            if (!_.isEmpty(data.income)) {
                symbol = currencyType(incomeTotals.find(o => o.key === item.value).key.toLocaleUpperCase()).symbol;

                if (convertExchange !== undefined && convertExchange !== null && convertExchange.toLocaleUpperCase() !== item.value.toLocaleUpperCase()) {
                    price = <Convert price={incomeTotals.find(o => o.key === item.value).value} from={item.value.toLocaleUpperCase()} to={convertExchange} />
                }

                price = localeAmountPrice(incomeTotals.find(o => o.key === item.value).value)
            }

            total.push({
                dataField: item.value,
                text: item.label,
                footer: symbol + price
            })

            return total;
        }, []);

        //Birleştirdim 2 tabloyu
        newOutcomeColumns = prefixColumns.concat(newOutcomeColumns);


        let incomeData = [];
        let outcomeData = [];

        if (!_.isEmpty(data.income)) {
            incomeData = data.income.reduce((total, item, i) => {

                let itemObj = columns.reduce((obj, currency, j) => {

                    let price = '';
                    let symbol = currencyType(item.currencies.find(o => o.key === currency.value).key.toLocaleUpperCase()).symbol

                    if (convertExchange !== undefined && convertExchange !== null && convertExchange.toLocaleUpperCase() !== currency.value.toLocaleUpperCase()) {
                        price = <Convert
                            price={item.currencies.find(o => o.key === currency.value).value}
                            from={currency.value.toLocaleUpperCase()}
                            to={convertExchange} />
                    }

                    price = localeAmountPrice(item.currencies.find(o => o.key === currency.value).value)

                    obj[item.value] = symbol + price;


                    return obj;
                }, {})

                itemObj.direction = item.flowDirectionSymbol === "+" ? <FormattedMessage id="header.incomeExplanation" /> : <FormattedMessage id="header.outcomeExplanation" />;
                itemObj.title = item.title;

                total.push(itemObj);

                return total;
            }, [])
        }

        if (!_.isEmpty(data.outcome)) {
            outcomeData = data.outcome.reduce((total, item, i) => {

                let itemObj = columns.reduce((obj, currency, j) => {

                    let price = '';
                    let symbol = currencyType(item.currencies.find(o => o.key === currency.value).key.toLocaleUpperCase()).symbol

                    if (convertExchange !== undefined && convertExchange !== null && convertExchange.toLocaleUpperCase() !== currency.value.toLocaleUpperCase()) {
                        price = <Convert
                            price={item.currencies.find(o => o.key === currency.value).value}
                            from={currency.value.toLocaleUpperCase()}
                            to={convertExchange} />
                    }

                    price = localeAmountPrice(item.currencies.find(o => o.key === currency.value).value)

                    obj[item.value] = symbol + price;


                    return obj;
                }, {})

                itemObj.direction = item.flowDirectionSymbol === "+" ? <FormattedMessage id="header.incomeExplanation" /> : <FormattedMessage id="header.outcomeExplanation" />;
                itemObj.title = item.title;

                total.push(itemObj);

                return total;
            }, [])
        }

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

            <BootstrapTable
                data={incomeData}
                columns={newIncomeColumns}
                cellEdit={cellEditFactory({ mode: 'dbclick' })} />
        </>
        )
    }
}

NewTable.propTypes = {
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
)(NewTable);




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