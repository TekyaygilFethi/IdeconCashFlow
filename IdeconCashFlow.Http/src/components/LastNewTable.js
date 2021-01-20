import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormattedMessage, injectIntl, } from "react-intl";
import Option from './Option';
import { connect } from 'react-redux';
import { currencyType, localeAmountPrice } from '../utils/helper';
import Popover from '@material-ui/core/Popover';
import _ from 'lodash';
import { IconButton } from '@material-ui/core/index';
import { InfoTwoTone, Add, Remove, KeyboardArrowDown, KeyboardArrowUp, Clear } from '@material-ui/icons/index';
import { incomeChangeValue, incomeChangePercent } from '../redux/modules/incomeChangeValue'
import { incomeHeaderAdd, incomeHeaderRemove } from '../redux/modules/incomeHeaderEvent'
import { outcomeChangeValue, outcomeChangePercent } from '../redux/modules/outcomeChangeValue'
import { outcomeHeaderAdd, outcomeHeaderRemove } from '../redux/modules/outcomeHeaderEvent'
import NumberFormat from 'react-number-format';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import BlockUi from 'react-block-ui';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import NewPieChart from './NewPieChart';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Slider from 'rc-slider';
import { Link } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator/lib/index';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import 'rc-slider/assets/index.css';
import { control } from '../utils/form';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import Slide from '@material-ui/core/Slide';
import Fab from '@material-ui/core/Fab';



const { ExportCSVButton } = CSVExport;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const incomerowStyle = (row, rowIndex) => {
    if (rowIndex % 2 === 0)
        return { backgroundColor: '#eaf5ea' };
    return { backgroundColor: '#e4efe2' };
};

const outcomerowStyle = (row, rowIndex) => {
    if (rowIndex % 2 === 0)
        return { backgroundColor: '#fbbbb7' };
    return { backgroundColor: '#f9c0bd' };
};

function editFormatter(cell, row) {
    let symbol = currencyType(cell.symbol).symbol
    let price = localeAmountPrice(cell.price)
    return (
        <span title="çift tıklayıp düzenleme yapabilirsiniz">{symbol + price} <i className="icon fas fa-edit" ></i></span >
    );

}


function titleFormatter(cell, row, index, handleRequestOpen) {
    return (
        <>
            <span className="text-cursor" onClick={handleRequestOpen.bind(this)} style={{ left: '-1px', right: '-1px', position: 'absolute' }} id={row.id} percent={row.percent} symbol={row.flowDirection}>{cell}</span >
            <i className="icon fas fa-percent"></i>
        </>

    );

}

function detailFormatter(cell, row, index, formatExtraData) {

    if (row.detail) {
        return (
            <IconButton size="small" onClick={() => formatExtraData.handleOnDelete(row)}>
                <Clear fontSize="inherit" />
            </IconButton>
        )

    } else {
        return (
            <IconButton size="small" onClick={formatExtraData.handleRequestOpen.bind(this)} id={row.id}>
                <InfoTwoTone fontSize="inherit" />
            </IconButton>
        )
    }
}

const pageButtonRendererIncome = ({ page, active, disable, title, onPageChange }) => {
    const handleClick = (e) => {
        e.preventDefault();
        onPageChange(page);
    };
    return (
        <ButtonGroup size="small" aria-label="small outlined button group" key={page}>
            {/* <Button key={page} onClick={handleClick} variant={`${this.state.pageIncome === page ? 'contained' : ''}`} color={`${this.state.pageIncome === page ? 'primary' : ''}`}>{page}</Button> */}
            <Button key={page} onClick={handleClick} variant={active ? 'contained' : ''} color={active ? 'primary' : 'default'}>{page}</Button>
        </ButtonGroup>
    );
};

const sizePerPageRendererIncome = ({ options, currSizePerPage, onSizePerPageChange }) => (
    <ButtonGroup size="small" aria-label="small outlined button group">
        {
            options.map((option) => {
                const isSelect = currSizePerPage === option.page.toString();
                const button = <Button key={option.text} onClick={() => onSizePerPageChange(option.page)} variant={isSelect ? 'contained' : ''} color={isSelect ? 'primary' : 'default'}>{option.text}</Button>
                return (
                    button
                );
            })
        }
    </ButtonGroup>
);

const pageButtonRendererOutcome = ({ page, active, disable, title, onPageChange }) => {
    const handleClick = (e) => {
        e.preventDefault();
        onPageChange(page);
    };
    return (
        <ButtonGroup size="small" aria-label="small outlined button group">
            {/* <Button key={page} onClick={handleClick} variant={`${this.state.pageOutcome === page ? 'contained' : ''}`} color={`${this.state.pageOutcome === page ? 'primary' : ''}`}>{page}</Button> */}
            <Button key={page} onClick={handleClick} variant={active ? 'contained' : ''} color={active ? 'primary' : ''}>{page}</Button>
        </ButtonGroup>
    );
};

const sizePerPageRendererOutcome = ({ options, currSizePerPage, onSizePerPageChange }) => (
    <ButtonGroup size="small" aria-label="small outlined button group">
        {
            options.map((option) => {
                const isSelect = currSizePerPage === option.page.toString();
                return (
                    // <Button key={option.text} onClick={() => onSizePerPageChange(option.page)} variant={`${isSelect ? 'contained' : ''}`} color={`${isSelect ? 'primary' : ''}`}>{option.text}</Button>
                    <Button key={option.text} onClick={() => onSizePerPageChange(option.page)} variant={isSelect ? 'contained' : ''} color={isSelect ? 'primary' : ''}>{option.text}</Button>
                );
            })
        }
    </ButtonGroup>
);

class PriceEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 0
        }
    }

    componentWillMount() {
        this.setState({
            price: this.props.value.price,
            symbol: currencyType(this.props.value.symbol).symbol
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
            <div className="row">
                <div className="col-sm-12">
                    <NumberFormat
                        prefix={this.state.symbol}
                        className="form-control"
                        {...rest}
                        value={price}
                        allowNegative={false}
                        decimalSeparator=","
                        decimalScale={2}
                        onValueChange={(values) => {
                            this.setState({ price: values.value.replace(".", ",") })
                        }} />
                </div>
            </div>
        ];
    }
}


class LastNewTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            columns: this.props.columns,
            convertExchange: this.props.convertExchange,
            mainTotals: this.props.mainTotals,
            symbol: this.props.symbol,
            isLoaded: false,
            itemOfHeaders: {},
            pageIncome: 1,
            pageOutcome: 1,
            percentageIncrease: [],
            percentHeader: '',
            selectedPercentHeader: {},
            modalOpen: false,
            flowDirection: '+',
            enTitle: '',
            trTitle: '',
            incomeSimilationCount: 0,
            outcomeSimilationCount: 0,
            incomeLoading: false,
            outcomeLoading: false,
            titleOpen: false
        };

        this.handlePercentChange = this.handlePercentChange.bind(this);
        this.handleOnClose = this.handleOnClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSaveAndClose = this.handleSaveAndClose.bind(this);
        this.handleOnDelete = this.handleOnDelete.bind(this);
        this.handleIncomeChange = this.handleIncomeChange.bind(this);
        this.handleOutcomeChange = this.handleOutcomeChange.bind(this);
        this.handlePercentChoose = this.handlePercentChoose.bind(this);
        this.handleExport = this.handleExport.bind(this);
    }

    handleOnDelete(row) {
        if (row.flowDirection === "+") {
            this.props.incomeHeaderRemove(row);
        } else {
            this.props.outcomeHeaderRemove(row);
        }
    }

    handleOnClose() {
        this.setState({
            modalOpen: false
        })
    }

    handleChange(e) {
        this.setState({
            flowDirection: e.target.value
        })
    }

    handleSaveAndClose() {
        let generateNumber = this.generateNumber();

        let currencies = this.state.incomeTotals.reduce((total, item, i) => {
            total.push({ key: item.key, value: 0 })
            return total;
        }, [])

        let data = {
            EnglishTitle: this.state.enTitle,
            TurkishTitle: this.state.trTitle,
            currencies: currencies,
            flowDirectionExplanation: this.state.flowDirection === "+" ? "Gelir" : "Gider",
            flowDirectionSymbol: this.state.flowDirection,
            id: generateNumber,
            isSimilation: true
        }


        if (this.state.flowDirection === "+") {
            this.props.incomeHeaderAdd(data);
        } else {
            this.props.outcomeHeaderAdd(data);
        }


        let percentageIncrease = this.state.percentageIncrease;
        percentageIncrease.push({
            label: this.props.lang === "tr" ? this.state.trTitle : this.state.enTitle,
            percent: 0,
            value: generateNumber
        })

        this.setState({
            percentageIncrease: percentageIncrease,
            open: false,
            trTitle: '',
            enTitle: '',
        })
    }



    handleSelectChange(e) {
        this.setState({ selectedPercentHeader: e })
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

    componentDidUpdate(prevProps, prevState) {
        if (prevState.itemOfHeaders !== this.state.itemOfHeaders) {
            this.setState({ isLoaded: true })
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const result = {};

        result.columns = nextProps.columns;


        result.incomeIsFetching = nextProps.inputHeaders.isFetching;
        result.incomeisFailure = nextProps.inputHeaders.isFailure;
        if (nextProps.inputHeaders.isLoaded) {
            result.convertExchange = nextProps.inputHeaders.convertedExchange;
            result.incomeLoading = nextProps.inputHeaders.isLoaded;
            if (nextProps.inputHeaders.data !== prevState.inData) {
                result.income = nextProps.inputHeaders.income;
                result.incomeTotals = nextProps.inputHeaders.incomeTotals;
                result.incomeOptions = nextProps.inputHeaders.incomeOptions;
                result.inData = nextProps.inputHeaders.data;
            }
        }

        result.outcomeIsFetching = nextProps.outputHeaders.isFetching;
        result.outcomeisFailure = nextProps.outputHeaders.isFailure;
        if (nextProps.outputHeaders.isLoaded) {

            result.convertExchange = nextProps.inputHeaders.convertedExchange;
            result.outcomeLoading = nextProps.outputHeaders.isLoaded;
            if (nextProps.outputHeaders.data !== prevState.outData) {
                result.outcome = nextProps.outputHeaders.outcome;
                result.outcomeTotals = nextProps.outputHeaders.outcomeTotals;
                result.outcomeOptions = nextProps.outputHeaders.outcomeOptions;
                result.outData = nextProps.outputHeaders.data;
            }
        }

        result.itemOfHeaderLoading = nextProps.itemOfHeaders.isLoaded;
        if (nextProps.itemOfHeaders.isLoaded) {
            result.itemOfHeaders = nextProps.itemOfHeaders.data.response
        }

        return result;
    }

    generateNumber = () => {
        return Math.floor(Math.random() * (9999999999 - 1999999999 + 1) + 1999999999).toString();
    }

    handlePercentChoose(id) {
        let selectedPercentHeader = this.state.percentageIncrease.find(x => x.value === id)
        this.setState({
            selectedPercentHeader: selectedPercentHeader
        })
    }

    handleIncomeChange = (type, { page, sizePerPage, data, cellEdit }) => {
        if (type === "pagination") {
            this.props.getChangeHeaders(page, sizePerPage, 'income')
        } else if ("cellEdit") {
            this.props.incomeChangeValue({ id: cellEdit.rowId, value: (cellEdit.newValue).replace(",", "."), currency: cellEdit.dataField })
        }
    }

    handleOutcomeChange = (type, { page, sizePerPage, data, cellEdit }) => {
        if (type === "pagination") {
            this.props.getChangeHeaders(page, sizePerPage, 'outcome')
        } else if ("cellEdit") {
            this.props.outcomeChangeValue({ id: cellEdit.rowId, value: (cellEdit.newValue).replace(",", "."), currency: cellEdit.dataField })
        }
    }

    handleTitlePercentOpen(e) {
        e.preventDefault();
        this.setState({
            titleOpen: !this.state.titleOpen,
            titleAnchorEl: e.currentTarget,
        });
    }

    handleTitlePercentClose() {
        this.setState({
            titleOpen: false,
            titleAnchorEl: null,
        });
    }

    handlePercentChange(value, id, symbol) {
        if (symbol === "+") {
            this.props.incomeChangePercent({ id: id, value: value });
        } else {
            this.props.outcomeChangePercent({ id: id, value: value })
        }
    }

    handleExport(e) {
        const data = [...this.state.inData, ...this.state.outData];
        e.baseProps.data = data;
        e.csvProps.onExport(data);
    }

    render() {
        const { lang, intl } = this.props;
        const { columns, convertExchange, itemOfHeaders, itemOfHeaderLoading } = this.state;
        const { inData, incomeTotals, incomeLoading, incomeIsFetching, incomeOptions, incomeisFailure } = this.state;
        const { outData, outcomeTotals, outcomeLoading, outcomeIsFetching, outcomeOptions } = this.state;


        let inOptions = []
        let newColumnsIncome = [];
        let outOptions = [];
        let newColumnsOutcome = [];
        if (incomeLoading) {
            let prefixColumnsIncome = [];
            prefixColumnsIncome = [
                { dataField: 'id', text: "ID", hidden: true, footer: "", csvExport: false },
                {
                    dataField: 'direction', text: intl.formatMessage({ id: "header.flowDirection" }).toString(), csvFormatter: (cell, row) => row.flowDirection, footer: intl.formatMessage({ id: "header.subtotal" }).toString(), footerStyle: (column, colIndex) => {
                        return {
                            color: '#fff'
                        };
                    },
                    editable: false, csvText: 'Akış Yönü', headerStyle: (column, colIndex) => {
                        return {
                            width: '12%'
                        };
                    },
                },
                {
                    dataField: 'title', text: intl.formatMessage({ id: "header.title" }).toString(), footer: '', editable: false, csvFormatter: (cell, row, rowIndex) => `${cell}`, formatter: titleFormatter, formatExtraData: (this.handleTitlePercentOpen.bind(this)), style: (cell, row, rowIndex, colIndex) => {
                        return {
                            position: 'relative'
                        };
                    }, headerStyle: (column, colIndex) => {
                        return {
                            minWidth: '20%'
                        };
                    },
                }
            ];



            newColumnsIncome = columns.reduce((total, item, i) => {
                let symbol = '';
                let price = '';

                if (_.isEmpty(convertExchange)) {
                    price = localeAmountPrice(incomeTotals.find(o => o.key === item.value).value);
                    symbol = currencyType(incomeTotals.find(o => o.key === item.value).key).symbol;
                } else {
                    price = localeAmountPrice(incomeTotals.find(o => o.key === item.value).value);
                    symbol = currencyType(incomeTotals.find(o => o.key === item.value).symbol).symbol;
                }

                total.push({
                    dataField: item.value,
                    text: item.label,
                    style: (cell, row, rowIndex, colIndex) => {
                        return {
                            position: 'relative'
                        };
                    },
                    footer: symbol + price,
                    formatter: editFormatter,
                    csvFormatter: (cell, row, rowIndex) => `${currencyType(cell.symbol).symbol} ${localeAmountPrice(cell.price)}`,
                    editorClasses: 'editing-name edit-simulation',
                    headerStyle: (column, colIndex) => {
                        return {
                            width: `${columns.length === 0 ? 50 : 50 / columns.length}%`
                        };
                    },
                    editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) =>
                        <PriceEdit {...editorProps} value={value} column={column} />
                })

                return total;
            }, []);
            newColumnsIncome = prefixColumnsIncome.concat(newColumnsIncome);
            newColumnsIncome = newColumnsIncome.concat([{
                dataField: 'detail',
                csvExport: false,
                formatter: detailFormatter,
                formatExtraData: ({ 'handleOnDelete': this.handleOnDelete, 'handleRequestOpen': this.handleRequestOpen.bind(this) }),
                text: <IconButton size="small" onClick={this.handleRequestOpen.bind(this)} id="all">
                    <InfoTwoTone fontSize="inherit" />
                </IconButton>, footer: "", editable: false, headerStyle: (column, colIndex) => {
                    return {
                        width: '3%'
                    };
                }
            }]);


            inOptions = {
                custom: true,
                sizePerPageRenderer: sizePerPageRendererIncome,
                pageButtonRenderer: pageButtonRendererIncome,
                page: incomeOptions.page,
                sizePerPage: incomeOptions.sizePerPage,
                totalSize: incomeOptions.totalSize,
                sizePerPageList: [{
                    text: '5', value: 5
                }, {
                    text: '10', value: 10
                }, {
                    text: '20', value: 20
                }]
            }
        }

        if (outcomeLoading && incomeLoading) {

            let prefixColumnsOutcome = [];

            let mainTotals = incomeTotals.reduce((total, item, index) => {
                let result = item.value - outcomeTotals[index].value
                total.push({ key: item.key, value: result })
                return total;
            }, [])

            prefixColumnsOutcome = [
                { dataField: 'id', text: "ID", hidden: true, footer: "" },
                {
                    dataField: 'direction', text: intl.formatMessage({ id: "header.subtotal" }).toString(), footer: "", editable: false, headerStyle: (column, colIndex) => {
                        return {
                            width: '12%'
                        };
                    },
                },
                {
                    dataField: 'title', text: intl.formatMessage({ id: "header.title" }), footer: "", classes: "text-cursor", editable: false, csvFormatter: (cell, row, rowIndex) => `${cell}`, formatter: titleFormatter, formatExtraData: (this.handleTitlePercentOpen.bind(this)), style: (cell, row, rowIndex, colIndex) => {
                        return {
                            position: 'relative',
                        };
                    }, headerStyle: (column, colIndex) => {
                        return {
                            minWidth: '20%',
                            color: '#fff'
                        };
                    },
                }
            ];

            newColumnsOutcome = columns.reduce((total, currency, i) => {
                let footerprice = '';
                let symbol = '';
                let price = '';


                footerprice = localeAmountPrice(mainTotals.find(o => o.key === currency.value).value);
                price = localeAmountPrice(outcomeTotals.find(o => o.key === currency.value).value);

                if (_.isEmpty(convertExchange)) {
                    symbol = currencyType(outcomeTotals.find(o => o.key === currency.value).key.toLocaleUpperCase()).symbol;
                } else {
                    symbol = currencyType(outcomeTotals.find(o => o.key === currency.value).symbol).symbol;
                }

                total.push({
                    dataField: currency.value,
                    text: symbol + footerprice,
                    formatter: editFormatter,
                    style: (cell, row, rowIndex, colIndex) => {
                        return {
                            position: 'relative'
                        };
                    },
                    footer: symbol + price,
                    editorClasses: 'editing-name edit-simulation',
                    headerStyle: (column, colIndex) => {
                        return {
                            width: `${columns.length === 0 ? 50 : 50 / columns.length}%`
                        };
                    },
                    editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) =>
                        <PriceEdit {...editorProps} value={value} column={column} />

                })

                return total;
            }, []);

            newColumnsOutcome = prefixColumnsOutcome.concat(newColumnsOutcome);

            newColumnsOutcome = newColumnsOutcome.concat([{
                dataField: 'detail',
                formatter: detailFormatter,
                formatExtraData: ({ 'handleOnDelete': this.handleOnDelete, 'handleRequestOpen': this.handleRequestOpen.bind(this) }),
                text: "", footer: "", headerStyle: (column, colIndex) => {
                    return {
                        width: '3%'
                    };
                }, editable: false
            }]);

            outOptions = {
                custom: true,
                sizePerPageRenderer: sizePerPageRendererOutcome,
                pageButtonRenderer: pageButtonRendererOutcome,
                page: outcomeOptions.page,
                sizePerPage: outcomeOptions.sizePerPage,
                totalSize: outcomeOptions.totalSize,
                sizePerPageList: [{
                    text: '5', value: 5
                }, {
                    text: '10', value: 10
                }, {
                    text: '20', value: 20
                }]
            }

        }

        let expandRow = {
            renderer: row => {
                if (itemOfHeaderLoading) {
                    let index = itemOfHeaders.findIndex((e) => e.anaBaslikID === row.id && e.symbol === row.flowDirection);

                    if (index > -1) {
                        let className = `col-sm-${12 / itemOfHeaders[index].tempItems.length}`
                        return (
                            <div>
                                <div className="row">
                                    {
                                        itemOfHeaders[index].tempItems.map((item, i) =>
                                            <div className={className}>
                                                <div className="card">
                                                    <p><span className="font-weight-bold">Açıklama:</span> {lang === "tr" ? item.turkishAciklama : item.englishAciklama}</p>
                                                    <p><span className="font-weight-bold">Vade Tarihi :</span> {moment(item.vadeTarihi).format("DD-MM-YYYY")}</p>
                                                    <p><span className="font-weight-bold">Tutar:</span> {localeAmountPrice(item.tutar)} {currencyType(item.code).symbol}</p>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="row float-right mt-1 mb-1">
                                    <div className="col-sm-12">
                                        <Link to={"item/" + row.id}>
                                            Devamını Gör
                                        </Link>
                                    </div>

                                </div>
                            </div>

                        )
                    } else {
                        return (<div className="row"></div>)
                    }
                }
            },
            showExpandColumn: true,
            expandByColumnOnly: true,
            expandHeaderColumnRenderer: ({ isAnyExpands }) => {
                if (_.isEmpty(itemOfHeaders)) {
                    return <CircularProgress size={15} />
                } else {
                    if (isAnyExpands) {
                        return <Remove fontSize="inherit" />
                    }
                    return <Add fontSize="inherit" />
                }

            },
            expandColumnRenderer: ({ expanded }) => {
                if (expanded) {
                    return (
                        <KeyboardArrowUp fontSize="inherit" />
                    );
                }
                return (
                    <KeyboardArrowDown fontSize="inherit" />
                );
            },
            className: "width5"
        };


        return (
            <div className="row">
                <Popover
                    open={this.state.titleOpen}
                    anchorEl={this.state.titleAnchorEl}
                    onClose={this.handleTitlePercentClose.bind(this)}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                >
                    <div className="row" style={{ width: '500px', paddingTop: '10px', paddingBottom: '25px', paddingLeft: '15px', paddingRight: '15px' }}>
                        <div className="col-sm-12 flex">
                            <div className="card">
                                {
                                    this.state.titleAnchorEl && (
                                        <Slider
                                            min={-25}
                                            max={25}
                                            step={5}
                                            dots
                                            tipFormatter={value => value}
                                            marks={{ '-25': '-25%', '-20': '-20%', '-15': '-15%', '-10': '-10%', '-5': '-5%', 0: '0%', 5: '5%', 10: '10%', 15: '15%', 20: '20%', 25: '25%' }}
                                            included={false}
                                            onChange={(e) => {
                                                this.handlePercentChange(e, this.state.titleAnchorEl.id, this.state.titleAnchorEl.attributes['symbol'].value)
                                            }}
                                            value={this.state.titleAnchorEl.attributes['percent'].value}
                                        />
                                    )
                                }

                            </div>
                        </div>
                    </div>

                </Popover>
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
                            <Option id={this.state.anchorEl.id} lang={lang} />
                        )
                    }
                </Popover>

                <div className="col-sm-8" id="tablerow">
                    <div className="card pb-5">
                        <BlockUi blocking={incomeIsFetching}>
                            {
                                this.state.incomeLoading && (
                                    <ToolkitProvider
                                        keyField="id"
                                        data={inData}
                                        exportCSV={{
                                            fileName: 'template.csv',
                                            noAutoBOM: false,
                                            blobType: 'text/csv;charset=utf-8;',
                                        }}
                                        columns={newColumnsIncome}>{
                                            props => (
                                                <PaginationProvider
                                                    pagination={paginationFactory(inOptions)}>
                                                    {
                                                        ({
                                                            paginationProps,
                                                            paginationTableProps
                                                        }) => (
                                                                <>
                                                                    <div className="breadcrumb-line breadcrumb-line-light header-elements-md-inline">

                                                                        <div className="col-sm-2">
                                                                            <Button color="primary" onClick={() => this.setState({ modalOpen: true })}>
                                                                                Sanal Başlık Ekle
                                                                            </Button>
                                                                        </div>
                                                                        <div className="d-flex align-items-center mb-3 mb-sm-0">
                                                                            <ExportCSVButton onClick={() => this.handleExport(props)} {...props.csvProps}><FormattedMessage id="exportcsv" /></ExportCSVButton>
                                                                        </div>
                                                                    </div>
                                                                    <div className="card-body d-sm-flex align-items-sm-center justify-content-sm-between flex-sm-wrap">
                                                                        <div className="d-flex align-items-center mb-3 mb-sm-0">
                                                                            <SizePerPageDropdownStandalone {...paginationProps} />
                                                                        </div>
                                                                        <div className="d-flex align-items-center mb-3 mb-sm-0">
                                                                            <PaginationListStandalone {...paginationProps} />
                                                                        </div>

                                                                    </div>
                                                                    <BootstrapTable
                                                                        remote
                                                                        {...props.baseProps}
                                                                        rowStyle={incomerowStyle}
                                                                        expandRow={expandRow}
                                                                        classes={"firstChild"}
                                                                        onTableChange={this.handleIncomeChange}
                                                                        cellEdit={cellEditFactory(
                                                                            {
                                                                                mode: 'click'
                                                                            }
                                                                        )}
                                                                        {...paginationTableProps}
                                                                    />

                                                                </>
                                                            )
                                                    }
                                                </PaginationProvider>
                                            )
                                        }

                                    </ToolkitProvider>
                                )
                            }{

                                incomeisFailure && (
                                    <div className="card-body text-center">
                                        <i className="icon-cross2 icon-2xs text-warning-400 border-warning-400 border-3 rounded-round p-3 mb-3 mt-1"></i>
                                        <h5 className="card-title">Hata oluştu</h5>
                                        <p className="mb-3">Yeniden yüklemeyi denemek için <span onClick={() => { this.props.getChangeHeaders() }}>tıklayınız</span></p>
                                    </div>
                                )


                            }
                        </BlockUi>
                        <BlockUi blocking={outcomeIsFetching}>
                            {
                                outcomeLoading && incomeLoading && (
                                    <ToolkitProvider
                                        keyField="id"
                                        data={outData}
                                        exportCSV={{
                                            noAutoBOM: false,
                                            blobType: 'text/csv;charset=windows-1254;'
                                        }}
                                        columns={newColumnsOutcome}>{
                                            props => (
                                                <PaginationProvider
                                                    pagination={paginationFactory(outOptions)}>
                                                    {
                                                        ({
                                                            paginationProps,
                                                            paginationTableProps
                                                        }) => (
                                                                <>
                                                                    <BootstrapTable
                                                                        remote
                                                                        {...props.baseProps}
                                                                        // keyField='id'
                                                                        // data={outData}
                                                                        // columns={newColumnsOutcome}
                                                                        rowStyle={outcomerowStyle}
                                                                        expandRow={expandRow}
                                                                        classes={"thead-footer firstChild"}
                                                                        onTableChange={this.handleOutcomeChange}
                                                                        cellEdit={cellEditFactory(
                                                                            {
                                                                                mode: 'click'
                                                                            }
                                                                        )}
                                                                        {...paginationTableProps}
                                                                    />
                                                                    <div className="card-body d-sm-flex align-items-sm-center justify-content-sm-between flex-sm-wrap">
                                                                        <div className="d-flex align-items-center mb-3 mb-sm-0">
                                                                            <SizePerPageDropdownStandalone {...paginationProps} />
                                                                        </div>
                                                                        <div className="d-flex align-items-center mb-3 mb-sm-0">
                                                                            <PaginationListStandalone {...paginationProps} />
                                                                        </div>

                                                                    </div>
                                                                </>


                                                            )
                                                    }
                                                </PaginationProvider>
                                            )
                                        }

                                    </ToolkitProvider>
                                )}
                        </BlockUi>
                    </div>
                </div>
                <div className="col-sm-4" id="chartrow">
                    <div className="card w-100 h-100 no-margin">
                        <NewPieChart />
                    </div>
                </div>
                <Dialog
                    open={this.state.modalOpen}
                    TransitionComponent={Transition}
                    onClose={this.handleOnClose}
                    aria-labelledby="form-dialog-title"
                >
                    <ValidatorForm ref="form" onSubmit={this.handleSaveAndClose}>
                        <DialogTitle id="form-dialog-title">
                            Sanal başlık oluşturma
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Oluşturulan başlık sisteme kayıt edilmeyecektir.
                            </DialogContentText>

                            <RadioGroup aria-label="position" name="position" value={this.state.flowDirection} onChange={this.handleChange} row>
                                <FormControlLabel
                                    value="+"
                                    control={<Radio color="primary" />}
                                    label="Gelir"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    value="-"
                                    control={<Radio color="primary" />}
                                    label="Gider"
                                    labelPlacement="start"
                                />
                            </RadioGroup>
                            <TextValidator
                                margin="dense"
                                value={this.state.newTitle}
                                label="Türkçe başlık"
                                type="text"
                                name="trTitle"
                                fullWidth
                                validators={['required']}
                                errorMessages={['this field is required']}
                                {...control(this, "trTitle", (elements) => {
                                    return elements.target.value;
                                })}
                            />
                            <TextValidator
                                margin="dense"
                                value={this.state.newTitle}
                                label="İngilizce başlık"
                                type="text"
                                name="enTitle"
                                fullWidth
                                validators={['required']}
                                errorMessages={['this field is required']}
                                {...control(this, "enTitle", (elements) => {
                                    return elements.target.value;
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
            </div>
        )
    }
}



LastNewTable.propTypes = {
    lang: PropTypes.string.isRequired,
    exchanges: PropTypes.objectOf(PropTypes.any).isRequired,
    incomeChangeValue: PropTypes.func.isRequired,
    incomeChangePercent: PropTypes.func.isRequired,
    outcomeChangePercent: PropTypes.func.isRequired,
    outcomeChangeValue: PropTypes.func.isRequired,
    incomeHeaderAdd: PropTypes.func.isRequired,
    incomeHeaderRemove: PropTypes.func.isRequired,
    outcomeHeaderAdd: PropTypes.func.isRequired,
    outcomeHeaderRemove: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    lang: state.locale.lang,
    exchanges: state.exchanges,
    outputHeaders: state.outputHeaders,
    mainHeaderTotals: state.mainHeaderTotals,
    inputHeaders: state.inputHeaders,
    itemOfHeaders: state.itemOfHeaders
});
const mapDispatchToProps = {
    incomeChangeValue,
    incomeChangePercent,
    outcomeChangeValue,
    incomeHeaderAdd,
    incomeHeaderRemove,
    outcomeHeaderAdd,
    outcomeHeaderRemove,
    outcomeChangePercent
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(LastNewTable));
