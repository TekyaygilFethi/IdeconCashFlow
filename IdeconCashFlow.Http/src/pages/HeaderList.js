import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, } from "react-intl";
import { Button, Dialog, AppBar, Toolbar, IconButton, Icon, Typography, Slide } from "@material-ui/core/index";
import _ from 'lodash';
import BlockUi from 'react-block-ui';

import { getInputHeaders } from '../redux/modules/inputHeader';
import { getOutputHeaders } from '../redux/modules/outputHeader';
import { getMainHeaderTotals } from '../redux/modules/mainHeaderTotals';
import { getItemOfHeader } from '../redux/modules/getItemOfHeader';
import { setExchange } from '../redux/modules/setExchange';
import { getExchange } from '../redux/modules/getExchange';
import { setColumns } from '../redux/modules/showTableColumn';
import LastNewTables from '../components/LastNewTable';
import FormField from '../components/common/FormField';
import { control } from '../utils/form';
import ItemAddModal from '../components/ItemAddModal';


const firstNullValue = [{ value: null, label: <FormattedMessage id="header.choose" /> }]

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class HeaderList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            rowsPerPage: 5,
            inputHeaders: {},
            outputHeaders: {},
            inputHeadersFetching: false,
            outputHeadersFetching: false,
            outputHeadersLoaded: false,
            inputHeadersLoaded: false,
            mainHeaderTotalsLoaded: false,
            columns: [],
            totals: [],
            showColumns: [],
            pristine: false,
            open: false,
            convertExchange: {},
            exchangePriceTypes: [],
            expandIdArray: []
        }
        this.getHeaders = this.getHeaders.bind(this);
        this.handleExchange = this.handleExchange.bind(this);
    }

    getHeaders(page = 1, rowsPerPage = 5, type) {
        if (type === 'income') {
            this.props.getInputHeaders({ page, rowsPerPage });
        } else if (type === 'outcome') {
            this.props.getOutputHeaders({ page, rowsPerPage });
        } else {
            this.props.getInputHeaders({ page, rowsPerPage });
            this.props.getOutputHeaders({ page, rowsPerPage });
        }
        // this.props.getMainHeaderTotals();
    }

    componentDidMount() {
        this.getHeaders();
        this.props.getExchange();

        let types = firstNullValue.slice();
        if (!_.isEmpty(this.props.chooseColumns)) {
            Array.prototype.push.apply(types, this.props.chooseColumns);
            this.setState({
                showColumns: this.props.chooseColumns,
                exchangePriceTypes: types
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let types = firstNullValue.slice();
        if (_.isEmpty(prevProps.chooseColumns)) {
            if (!this.state.pristine && this.state.showColumns.length === 0 && this.state.inputHeaders.isLoaded) {
                debugger;
                Array.prototype.push.apply(types, this.state.columns);
                this.setSState({
                    showColumns: this.state.columns,
                    exchangePriceTypes: types
                })
            }
        }

        if (prevProps.chooseColumns !== this.props.chooseColumns) {
            debugger;
            Array.prototype.push.apply(types, this.props.chooseColumns);
            this.setState({
                showColumns: this.props.chooseColumns,
                exchangePriceTypes: types
            })
        }
        if (this.state.inputHeadersLoaded && this.state.outputHeadersLoaded) {
            if (!_.isEqual(prevState.expandIdArray, this.state.expandIdArray)) {
                this.props.getItemOfHeader(this.state.expandIdArray);
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const result = {};
        let outSideData = {};
        let expandIdArray = [];
        result.inputHeadersFetching = nextProps.inputHeaders.isFetching;
        result.inputHeadersLoaded = nextProps.inputHeaders.isLoaded;
        if (nextProps.inputHeaders.isLoaded) {

            if (nextProps.inputHeaders !== prevState.inputHeaders) {

                result.inputHeaders = nextProps.inputHeaders.data;
                result.incomeTotals = nextProps.inputHeaders.incomeTotals;
                outSideData.income = nextProps.inputHeaders.income;
                result.columns = nextProps.inputHeaders.columns;
                let incomeArrayIds = nextProps.inputHeaders.incomeArrayIds;
                Array.prototype.push.apply(expandIdArray, incomeArrayIds);

                if (!_.isEmpty(nextProps.chooseColumns)) {
                    nextProps.chooseColumns.map((col, k) => {
                        if (!_.some(result.columns, col)) {
                            debugger;
                            result.chooseColumns = result.columns;
                            result.showColumns = result.columns;
                            const types = firstNullValue;
                            Array.prototype.push.apply(types, result.columns);
                            result.exchangePriceTypes = types;
                        }
                    })
                }
            }
            result.incomeOptions = nextProps.inputHeaders.incomeOptions;
        }

        result.outputHeadersFetching = nextProps.outputHeaders.isFetching;
        result.outputHeadersLoaded = nextProps.outputHeaders.isLoaded;

        if (nextProps.outputHeaders.isLoaded) {
            if (nextProps.outputHeaders !== prevState.outputHeaders) {
                result.outputHeaders = nextProps.outputHeaders.data
                result.outcomeTotals = nextProps.outputHeaders.outcomeTotals;
                outSideData.outcome = nextProps.outputHeaders.outcome;
                result.columns = nextProps.outputHeaders.columns;
                let outArrayIds = nextProps.outputHeaders.outcomeArrayIds;
                Array.prototype.push.apply(expandIdArray, outArrayIds);
                result.outcomeOptions = nextProps.outputHeaders.outcomeOptions;
            }
        }

        if (nextProps.itemOfHeaders.isLoaded) {
            result.itemOfHeaders = nextProps.itemOfHeaders.data.response
        }

        result.outSideData = outSideData;
        result.expandIdArray = expandIdArray;
        return { ...result };
    }

    setShowTableColumns = columns => {

        if (!this.state.pristine) {
            this.setState({
                pristine: true
            });
        }
        if (_.isNull(columns)) {
            columns = [];
        }
        this.props.setColumns(columns);
        return columns;
    }

    onTouch = value => {
        return value;
    }

    handleClickOpenCloseAddItem = (e) => {

        if (e === 'close') {
            this.setState({
                open: false
            })
        } else {
            this.setState({
                open: !this.state.open
            })
        }

    }

    handleExchange(e) {
        this.props.setExchange(e);
    }


    render() {
        const { outputHeadersFetching, inputHeadersFetching, columns, showColumns, open, exchangePriceTypes } = this.state;

        return (
            <>
                <div className="page-header page-header-light">
                    <div className="page-header-content header-elements-md-inline">
                        <div className="page-title d-flex">
                            <h4>
                                <span className="font-weight-semibold">
                                    <FormattedMessage id="header.incomeoutcome" />
                                </span>
                            </h4>
                        </div>
                    </div>
                </div>

                <div className="row mt-1 mb-2">
                    <div className="col-xl-12" id="header-table">
                        <div className="card">
                            <div className="header-elements-sm-inline pt-2">
                                <BlockUi tag="div" blocking={inputHeadersFetching && outputHeadersFetching} className="col-sm-3">
                                    <FormField
                                        label="Kur çevrimi"
                                        type="select"
                                        closeMenuOnSelect={true}
                                        options={exchangePriceTypes}
                                        {...control(this, 'convertExchange', this.handleExchange)}
                                    />
                                </BlockUi>
                                <BlockUi tag="div" blocking={inputHeadersFetching && outputHeadersFetching} className="col-sm-7">
                                    <FormField
                                        label="Gösterilen Para Birimleri"
                                        type="select"
                                        closeMenuOnSelect={false}
                                        onChange={this.setShowTableColumns}
                                        options={columns}
                                        isMulti={true}
                                        removeSelected={this.state.showColumns}
                                        noOptionsMessage={() => <FormattedMessage id="header.nooption" />}
                                        {...control(this, 'showColumns', this.setShowTableColumns)}
                                    />
                                </BlockUi>
                                <div className="col-sm-2 form-group">
                                    <Button variant="outlined" color="primary" className="mt16" onClick={() => this.handleClickOpenCloseAddItem()}>
                                        <FormattedMessage id="item.add" />
                                    </Button>
                                    <Dialog
                                        fullScreen
                                        open={open}
                                        onClose={this.handleClickOpenCloseAddItem}
                                        TransitionComponent={Transition}
                                    >
                                        <AppBar style={{ position: 'relative' }} className="appBar">
                                            <Toolbar>
                                                <Typography variant="h6" style={{ flex: 1 }}>
                                                    <FormattedMessage id="item.add" />
                                                </Typography>
                                                <IconButton
                                                    edge="start"
                                                    color="inherit"
                                                    onClick={this.handleClickOpenCloseAddItem}
                                                    aria-label="Close"
                                                >
                                                    <Icon>close</Icon>
                                                </IconButton>
                                            </Toolbar>
                                        </AppBar>
                                        <ItemAddModal onClose={this.handleClickOpenCloseAddItem} />
                                    </Dialog>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {/* <BlockUi tag="div" className="row mt-2 w100" blocking={!outputHeadersLoaded || !inputHeadersLoaded}> */}
                {
                    // inputHeadersLoaded && outputHeadersLoaded && (
                    <LastNewTables
                        // income={inputHeaders.headers}
                        // incomeOptions={this.state.incomeOptions}
                        // outcome={outputHeaders.headers}
                        // outcomeOptions={this.state.outcomeOptions}
                        getChangeHeaders={this.getHeaders}
                        columns={showColumns}
                    // itemOfHeaders={this.state.itemOfHeaders}
                    />
                    // )
                }

                {/* </BlockUi> */}

            </>
        )
    }
}


HeaderList.propTypes = {
    getInputHeaders: PropTypes.func.isRequired,
    getOutputHeaders: PropTypes.func.isRequired,
    getMainHeaderTotals: PropTypes.func.isRequired,
    getExchange: PropTypes.func.isRequired,
    setColumns: PropTypes.func.isRequired,
    getItemOfHeader: PropTypes.func.isRequired,
    setExchange: PropTypes.func.isRequired
};
HeaderList.defaultProps = {};

const mapStateToProps = state => ({
    outputHeaders: state.outputHeaders,
    mainHeaderTotals: state.mainHeaderTotals,
    inputHeaders: state.inputHeaders,
    exchanges: state.exchanges,
    chooseColumns: state.columns,
    itemOfHeaders: state.itemOfHeaders
});
const mapDispatchToProps = {
    getInputHeaders,
    getMainHeaderTotals,
    getOutputHeaders,
    getExchange,
    setColumns,
    getItemOfHeader,
    setExchange
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(HeaderList));




//  <div className="card-body d-sm-flex align-items-sm-center justify-content-sm-left flex-sm-wrap">
//     {
//         inputHeaders.isLoaded && (
//             totals.map((item, i) =>
//                 <div key={i} className="d-flex align-items-center mb-3 mb-sm-0">
//                     <div id="campaigns-donut"></div>
//                     <div className="ml-3">
//                         <h5 className="font-weight-semibold mb-0"> <FormattedMessage id={`${item.key.toLocaleUpperCase()}`} />  ({item.key.toLocaleUpperCase()})
//                     </h5>
//                         <h5 className="font-weight-semibold mb-0">
//                             {
//                                 item.value > 0 && (
//                                     <span className="text-success font-size-xl font-weight-normal">
//                                         <i className="icon-arrow-up12"></i>  ({localeAmountPrice(item.value)}) {currencyType(item.key.toLocaleUpperCase()).symbol}
//                                     </span>
//                                 )
//                             }
//                             {
//                                 item.value <= 0 && (
//                                     <span className="text-danger font-size-xl font-weight-normal">
//                                         <i className="icon-arrow-down12"></i>  ({item.value}) {currencyType(item.key.toLocaleUpperCase()).symbol}
//                                     </span>
//                                 )
//                             }
//                         </h5>
//                     </div>
//                 </div>
//             )
//         )
//     }
// </div>















