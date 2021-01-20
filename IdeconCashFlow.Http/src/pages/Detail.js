import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment'
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import { FormattedMessage, injectIntl } from 'react-intl';
import { currencyType, localeAmountPrice } from '../utils/helper';
import { getDetail } from '../redux/modules/getDetail'
import { getItemForDate, clearItemForDate } from '../redux/modules/getItemForDate'
import Preloader from '../components/common/PreLoader';



const rowStyle = (row, rowIndex) => {
    if (row.isCustom)
        if (rowIndex % 2 === 0) {
            return { backgroundColor: '#fff' };
        } else {
            return { backgroundColor: '#fff' };
        }
};

class PriceEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 0
        }
    }
    componentWillMount() {
        let symbol = currencyType(this.props.row.currency).symbol
        this.setState({
            price: this.props.value.replace(symbol, ""),
            symbol: symbol
        })
    }

    static propTypes = {
        price: PropTypes.number,
        onUpdate: PropTypes.func.isRequired
    }

    handleOnChange(e) {

        this.setState({
            price: e.target.value
        })

    }

    getValue() {
        return `${this.state.price}`;
    }

    render() {
        const { onUpdate, value, defaultValue, ...rest } = this.props;
        const { price } = this.state;
        return [
            <NumberFormat
                prefix={this.state.symbol}
                className="form-control edit-simulation"
                {...rest}
                value={price}
                decimalSeparator=","
                decimalScale={2}
                onValueChange={(values) => {
                    this.setState({ price: values.value.replace(".", ",") })
                }} />
        ];
    }
}

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: [],
            id: null,
            startDate: null,
            viewType: null,
            data: [],
            keys: [],
            itemForDates: [], itemLoading: false, itemLoaded: false, itemIsFailed: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleGetItemForDate = this.handleGetItemForDate.bind(this);
    }

    componentDidMount() {
        this.props.clearItemForDate();
        let id = this.props.match.params.id;
        let startDate = this.props.match.params.startDate;
        let viewType = this.props.match.params.viewType;
        const data = { 'singleHeaderId': id, 'startDate': startDate, 'filterType': viewType };
        this.props.getDetail(data);
        this.setState({ id, startDate, viewType, itemForDates: [], itemLoading: false, itemLoaded: false, itemIsFailed: false });
    }

    handleGetItemForDate(id, startDate) {
        const viewType = this.state.viewType;
        startDate = moment(startDate, "DDMMYYYY")
        let endDate = new Date();
        switch (viewType) {
            case "d":
                endDate = moment(startDate).add(1, 'day').format('YYYY/MM/DD');
                break;
            case "w":
                endDate = moment(startDate).add(6, 'day').format('YYYY/MM/DD');
                break;
            case "m":
                endDate = moment(startDate).add(1, 'M').add(-1, 'day').format('YYYY/MM/DD');
                break;
            default:
                break;
        }

        this.props.getItemForDate({
            id: id,
            startDate: moment(startDate).format('YYYY/MM/DD'),
            endDate: endDate
        });
    }

    handleChange(id, value, currency, date) {
        let { response } = this.state;
        let index = response.getDetail.findIndex((e) => e.anaBaslikID === id);
        let currencyIndex = response.getDetail[index].Contents.findIndex((e) => e.ParaBirimi === currency)
        let dateIndex = response.getDetail[index].Contents[currencyIndex].CurrencyDates.findIndex((e) => moment(e.vadeTarihi).format("DDMMYYYY") === date)
        response.getDetail[index].Contents[currencyIndex].CurrencyDates[dateIndex].Tutar = parseFloat(value);
        this.setState(response);
    }

    static getDerivedStateFromProps(nextProps) {
        const result = {};
        result.loading = nextProps.details.isFetching;
        if (nextProps.details.isLoaded) {
            result.details = nextProps.details;
            result.response = nextProps.details.data.response;
        }

        result.itemLoading = nextProps.itemForDate.isFetching;
        result.itemIsFailed = nextProps.itemForDate.isFailure;
        result.itemLoaded = nextProps.itemForDate.isLoaded
        if (nextProps.itemForDate.isLoaded) {
            result.itemForDates = nextProps.itemForDate.data.response;
        }

        if (nextProps.itemForDate.isFailure) {

            result.itemForDates = null;
        }

        return { ...result };
    }

    goBack() {
        this.props.history.push('/');
    }


    render() {
        const { details, response, viewType, itemForDates, itemLoading, itemLoaded, itemIsFailed } = this.state;
        const { intl, lang } = this.props;
        let columns = [];
        let data = [];
        let nonEditableRows = []


        if (details.isLoaded) {
            let date12 = [];

            let prefixColumnsIncome = [
                { dataField: 'id', text: "ID", hidden: true, },
                { dataField: 'definition', text: <FormattedMessage id="detail.definition" />, editable: false, classes: "nowrap " },
                { dataField: 'currency', text: <FormattedMessage id="detail.currency" />, editable: false }
            ]

            columns = response.getDetail[0].Contents[0].CurrencyDates.reduce((total, item, i) => {
                date12.push(item.vadeTarihi);
                let text = "";
                switch (viewType) {
                    case "d":
                        text = moment(item.vadeTarihi).format('DD.MM.YYYY');
                        break;
                    case "w":
                        text = moment(item.vadeTarihi).format('DD.MM.YYYY') + " " + moment(item.vadeTarihi).add(7, 'day').format('DD.MM.YYYY')
                        break;
                    case "m":
                        text = moment(item.vadeTarihi).format('DD.MM.YYYY') + " " + moment(item.vadeTarihi).add(1, 'M').format('DD.MM.YYYY')
                        break;
                    default:
                        break;
                }

                total.push({
                    dataField: moment(item.vadeTarihi).format("DDMMYYYY"),
                    text: text,
                    events: {
                        onClick: (e, column, columnIndex, row, rowIndex) => {
                            if (!row.isCustom) {
                                this.handleGetItemForDate(row.id, column.dataField)
                            }
                        },

                    },
                    editorClasses: 'editing-name',
                    style: (cell, row, rowIndex, colIndex) => {

                        let value = parseFloat(cell.replace(currencyType(row.currency).symbol, ""))
                        if (value > 0) {
                            return {
                                backgroundColor: '#81c784'
                            };
                        } else if (value < 0) {
                            return {
                                backgroundColor: '#f44336'
                            };
                        }

                    },
                    editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) =>
                        <PriceEdit {...editorProps} value={value} column={column} row={row} />
                })

                return total;
            }, []);


            columns = prefixColumnsIncome.concat(columns);

            // let totalObj = response.Totals.reduce((total, item, i) => {
            //     total[item.paraBirimi] = ((item.paraBirimi in total) ? total[item.paraBirimi] : 0) + item.toplamTutar
            //     return total;
            // }, {})

            columns = columns.concat([{
                dataField: 'totals', text: "Toplam", editable: false
            }]);

            // BAŞLIK SUTUNUNU YAPTM YUKARDA

            let previous = [];
            previous = response.openingBalance.reduce((total, item, i) => {
                let allTotal = item.amount;
                let previousTotal = 0;
                let obj1 = {}
                date12.reduce((dateTotal, date, j) => {
                    obj1[moment(date).format("DDMMYYYY")] = currencyType(item.currency.toLocaleUpperCase()).symbol + "" + localeAmountPrice(allTotal + previousTotal);

                    allTotal = allTotal + previousTotal;
                    previousTotal = response.getDetail.reduce((detailTotal, detail, k) => {
                        let ifExitcurrencyDates = detail.Contents.find(x => x.ParaBirimi === item.currency);
                        if (!_.isEmpty(ifExitcurrencyDates)) {
                            detailTotal += ifExitcurrencyDates.CurrencyDates.find(x => x.vadeTarihi === date).Tutar;
                        }
                        return detailTotal;
                    }, 0)

                    return dateTotal;
                }, 0)



                obj1.totals = currencyType(item.currency.toLocaleUpperCase()).symbol + localeAmountPrice(allTotal);
                obj1.currency = item.currency;
                obj1.id = "openingBalance-" + item.currency;
                obj1.definition = <FormattedMessage id="openingBalance" />
                obj1.isCustom = true;
                nonEditableRows.push("openingBalance-" + item.currency)
                total.push(obj1);
                return total;
            }, [])
            data = data.concat(previous);

            let dataSample = response.getDetail.reduce((total, item, i) => {

                let obj = item.Contents.reduce((contentObj, content, j) => {
                    let newTotalCurrency = 0;
                    contentObj = content.CurrencyDates.reduce((currencyTotal, currency, k) => {
                        currencyTotal[moment(currency.vadeTarihi).format("DDMMYYYY")] = currencyType(content.ParaBirimi.toLocaleUpperCase()).symbol + localeAmountPrice(currency.Tutar);
                        newTotalCurrency = newTotalCurrency + currency.Tutar
                        return currencyTotal;
                    }, {});
                    contentObj.currency = content.ParaBirimi;
                    // contentObj.totals = currencyType(content.ParaBirimi.toLocaleUpperCase()).symbol + localeAmountPrice(response.Totals.find(x => x.anaBaslikID === item.anaBaslikID && x.paraBirimi === content.ParaBirimi).toplamTutar)
                    contentObj.totals = currencyType(content.ParaBirimi.toLocaleUpperCase()).symbol + localeAmountPrice(newTotalCurrency)

                    contentObj.id = item.anaBaslikID;
                    contentObj.definition = (this.props.lang === "tr") ? item.turkishAnaBaslikTanim : item.englishAnaBaslikTanim;
                    total.push(contentObj)
                    return contentObj;
                }, {});




                return total;
            }, []);

            data = data.concat(dataSample);

            let laters = response.openingBalance.reduce((total, item, i) => {
                let allTotal = item.amount;
                let obj = {}
                date12.reduce((dateTotal, date, j) => {
                    let previousTotal = response.getDetail.reduce((detailTotal, detail, k) => {
                        let currencyDates = detail.Contents.find(x => x.ParaBirimi === item.currency);
                        if (!_.isEmpty(currencyDates))
                            detailTotal += currencyDates.CurrencyDates.find(x => x.vadeTarihi === date).Tutar;
                        return detailTotal;
                    }, 0)

                    obj[moment(date).format("DDMMYYYY")] = currencyType(item.currency.toLocaleUpperCase()).symbol + localeAmountPrice(allTotal + previousTotal);
                    allTotal = allTotal + previousTotal;
                    return dateTotal;
                }, 0)



                obj.totals = currencyType(item.currency.toLocaleUpperCase()).symbol + localeAmountPrice(allTotal);
                obj.currency = item.currency;
                obj.id = "closeingBalance-" + item.currency;
                obj.definition = <FormattedMessage id="balanceAtEndOfYear" />
                obj.isCustom = true;
                nonEditableRows.push("closeingBalance-" + item.currency)
                total.push(obj);
                return total;
            }, []);
            data = data.concat(laters);

        } else {
            return (
                <>
                    <div className="page-header page-header-light mb-2">
                        <div className="breadcrumb-line breadcrumb-line-light header-elements-md-inline">
                            <div className="d-flex">
                                <div className="breadcrumb">
                                    <Link to="/" className="breadcrumb-item">
                                        <i className="icon-home2 mr-2"></i> <FormattedMessage id="sidebar.home" />
                                    </Link>
                                    {this.state.viewType === "d" && (<span className="breadcrumb-item active"><FormattedMessage id="date.option.day" /> </span>)}
                                    {this.state.viewType === "w" && (<span className="breadcrumb-item active"><FormattedMessage id="date.option.week" />  </span>)}
                                    {this.state.viewType === "m" && (<span className="breadcrumb-item active"><FormattedMessage id="date.option.month" />  </span>)}
                                </div>
                            </div>

                            <div className="header-elements d-none">
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card">
                                <Preloader loading={true} height="200px" />
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        return (
            <div className="content">
                <div className="page-header page-header-light mb-2">
                    <div className="breadcrumb-line breadcrumb-line-light header-elements-md-inline">
                        <div className="d-flex">
                            <div className="breadcrumb">
                                <Link to="/" className="breadcrumb-item">
                                    <i className="icon-home2 mr-2"></i> <FormattedMessage id="sidebar.home" />
                                </Link>
                                {this.state.viewType === "d" && (<span className="breadcrumb-item active"><FormattedMessage id="date.option.day" /> </span>)}
                                {this.state.viewType === "w" && (<span className="breadcrumb-item active"><FormattedMessage id="date.option.week" />  </span>)}
                                {this.state.viewType === "m" && (<span className="breadcrumb-item active"><FormattedMessage id="date.option.month" />  </span>)}
                            </div>


                        </div>

                        <div className="header-elements d-none">
                        </div>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-sm-12">
                        <div className="card">
                            <Preloader loading={this.state.loading} height="200px" />
                            <div className="table-responsive">
                                {
                                    details.isLoaded && !this.state.loading && (

                                        <BootstrapTable
                                            keyField='id'
                                            data={data}
                                            columns={columns}
                                            rowStyle={rowStyle}
                                            cellEdit={cellEditFactory(
                                                {
                                                    nonEditableRows: () => nonEditableRows,
                                                    mode: 'dbclick',
                                                    afterSaveCell: (oldValue, newValue, row, column) => {
                                                        this.handleChange(row.id, newValue.replace(",", "."), row.currency, column.dataField)
                                                    }
                                                }
                                            )}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Preloader loading={itemLoading} height="200spx" />
                {
                    (itemLoaded && !itemIsFailed) && (
                        <div className="card">
                            <div className="row">
                                <div className="col-sm-12">
                                    {
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th><FormattedMessage id="header.flowDirection" /></th>
                                                        <th><FormattedMessage id="item.undertitle" /></th>
                                                        <th><FormattedMessage id="dueDate" /></th>
                                                        <th><FormattedMessage id="item.amount" /></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {

                                                        itemForDates.map((item, i) =>
                                                            <tr key={item.id}>
                                                                <td>{item.ItemFlowStatus === "+" ? <FormattedMessage id="header.incomeExplanation" /> : <FormattedMessage id="header.outcomeExplanation" />}</td>
                                                                <td>{lang === "tr" ? item.TurkishExplanation : item.EnglishExplanation}</td>
                                                                <td>{moment(item.dueDate).format("DD-MM-YYYY")}</td>
                                                                <td> {currencyType(item.currency).symbol}{localeAmountPrice(item.amount)}</td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                    }
                                </div>

                            </div>
                        </div>

                    )
                }  {
                    itemIsFailed && (
                        <div className="card-body text-center">
                            <i className="icon-cross2 icon-2xs text-warning-400 border-warning-400 border-3 rounded-round p-3 mb-3 mt-1"></i>
                            <h5 className="card-title">Hata oluştu</h5>
                            <p className="mb-3">Masraf bulunmadı.</p>
                        </div>
                    )
                }
            </div>
        )
    }
}


Detail.propTypes = {
    lang: PropTypes.string.isRequired,
    getDetail: PropTypes.func.isRequired,
    getItemForDate: PropTypes.func.isRequired,
    clearItemForDate: PropTypes.func.isRequired,
    exchanges: PropTypes.objectOf(PropTypes.any).isRequired,
};
Detail.defaultProps = {};

const mapStateToProps = state => ({
    lang: state.locale.lang,
    details: state.details,
    exchanges: state.exchanges,
    itemForDate: state.itemForDate
});
const mapDispatchToProps = {
    getDetail,
    getItemForDate,
    clearItemForDate
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(Detail));


