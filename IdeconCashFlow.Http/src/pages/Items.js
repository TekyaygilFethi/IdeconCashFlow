import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { getAllItemOfHeader } from '../redux/modules/getIAlltemOfHeader'
import { deleteItems } from '../redux/modules/deleteItems'
import { currencyType, localeAmountPrice } from '../utils/helper';
import _ from 'lodash';
import Preloader from '../components/common/PreLoader';
import { Link } from 'react-router-dom'
import moment from 'moment'
import { IconButton } from '@material-ui/core/index';
import { Clear } from '@material-ui/icons/index';
import Popper from '@material-ui/core/Popper';
import BlockUi from 'react-block-ui';
import LinearProgress from '@material-ui/core/LinearProgress';

class Items extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            id: null,
            loading: true,
            loaded: false,
            anchorEl: null,
            open: false,
            openOnly: false,
            anchorElOnly: null,
            loadingID: null
        }

        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        this.handleDeleteItems = this.handleDeleteItems.bind(this);
        this.handleDeletePopper = this.handleDeletePopper.bind(this);
        this.handleDeletePopperOnly = this.handleDeletePopperOnly.bind(this);
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        const data = {
            'singleHeaderId': id,
        };

        this.setState({ id });

        this.props.getAllItemOfHeader({ headerID: id });
    }

    static getDerivedStateFromProps(nextProps, PrevState) {
        const result = {};


        result.loading = nextProps.itemAllOfHeaders.isFetching;
        if (nextProps.itemAllOfHeaders.isLoaded) {
            result.loaded = nextProps.itemAllOfHeaders.isLoaded;
            result.items = nextProps.itemAllOfHeaders.data.response.items;
            result.header = nextProps.itemAllOfHeaders.data.response.headerName;
            result.currecyTotals = nextProps.itemAllOfHeaders.currencyTotals;


            result.size = 12 / (Object.entries(nextProps.itemAllOfHeaders.currencyTotals).length)

            return { ...result };
        }


        if (nextProps.deletedItemResult.isLoaded) {
            result.deleteResponse = nextProps.deletedItemResult.data.response;
            result.loadingID = null;
        }
        if (nextProps.deletedItemResult.isFailed) {
            result.loadingID = null;
        }
    }

    handleDeleteItem(id) {


        let data = [];
        if (this.state.items.findIndex(x => x.id === id && x.isUserCreation === true) > -1) {
            data.push(id)
            this.setState({ loadingID: id, openOnly: false })
            this.props.deleteItems(data);
        } else {
            //TODO Hata mesajı verdirilecek.
        }
    }

    handleDeleteItems(e) {


        let data = this.state.items.reduce((total, item, i) => {
            if (item.isUserCreation) {
                total.push(item.id)
            }
            return total;
        }, [])
        this.setState({ open: false })
        this.props.deleteItems(data)
    }

    handleDeletePopper(e) {
        e.preventDefault();
        this.setState({
            open: !this.state.open,
            anchorEl: e.currentTarget,
        });
    }
    handleDeletePopperOnly(id, e) {
        e.preventDefault();
        this.setState({
            openOnly: !this.state.openOnly,
            anchorElOnly: e.currentTarget,
            itemID: id
        });
    }

    render() {

        const { lang } = this.props;
        const { items, header, currecyTotals, size, loaded, loading } = this.state;
        return (
            <>
                <Popper placement="bottom-end" open={this.state.open} anchorEl={this.state.anchorEl} transition>
                    {({ TransitionProps }) => (
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card card-body border-top-1 border-top-pink">
                                    <div className="text-center">
                                        <h6 className="m-0 font-weight-semibold">Silmek istediğinize emin misiniz ?</h6>
                                        <p className="text-muted mb-3">Bu Başlık altındaki silinebilir kalemlerin hepsini silmek istediğinize emin misiniz ?</p>

                                        <button type="button" className="btn btn-outline bg-indigo-400 text-indigo-400 border-indigo-400 legitRipple" onClick={() => this.handleDeleteItems()}>Evet, Sil</button>
                                        <button type="button" className="btn btn-outline bg-pink-400 text-pink-400 border-pink-400 ml-1 legitRipple" onClick={() => { this.setState({ open: false }) }}>Hayır, Silme</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Popper>
                <Popper placement="bottom-end" open={this.state.openOnly} anchorEl={this.state.anchorElOnly} transition>
                    {({ TransitionProps }) => (
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card card-body border-top-1 border-top-pink">
                                    <div className="text-center">
                                        <h6 className="m-0 font-weight-semibold">Silmek istediğinize emin misiniz ?</h6>
                                        <p className="text-muted mb-3">Bu masrafı silmek istediğinize emin misiniz ?</p>

                                        <button type="button" className="btn btn-outline bg-indigo-400 text-indigo-400 border-indigo-400 legitRipple" onClick={() => this.handleDeleteItem(this.state.itemID)}>Evet, Sil</button>
                                        <button type="button" className="btn btn-outline bg-pink-400 text-pink-400 border-pink-400 ml-1 legitRipple" onClick={() => { this.setState({ openOnly: false }) }}>Hayır, Silme</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Popper>
                <div className="page-header page-header-light mb-2">
                    <div className="breadcrumb-line breadcrumb-line-light header-elements-md-inline">
                        <div className="d-flex">
                            <div className="breadcrumb">
                                <Link to={"/"} className="breadcrumb-item">
                                    <i className="icon-home2 mr-2"></i><FormattedMessage id="sidebar.home" />
                                </Link><span className="breadcrumb-item active"><FormattedMessage id="detailDisplay" /> </span>
                            </div>
                        </div>

                        <div className="header-elements d-none">
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <BlockUi blocking={loading}>
                                {
                                    loaded && (
                                        <>
                                            <div className="card-header header-elements-inline">
                                                <h6 className="card-title">{lang === "tr" ? header.turkishName : header.englishName}</h6>
                                            </div>
                                            <div className="card-body py-0">
                                                <div className="row text-center">
                                                    {
                                                        Object.entries(currecyTotals).map((item, i) =>
                                                            <div className={`col-${size}`}>
                                                                <div className="mb-3">
                                                                    <h5 className="font-weight-semibold mb-0">{localeAmountPrice(item[1])}{currencyType(item[0]).symbol}</h5>
                                                                    <span className="text-muted font-size-sm">{currencyType(item[0]).code}</span>
                                                                </div>
                                                            </div>)
                                                    }
                                                </div>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th><FormattedMessage id="header.flowDirection" /></th>
                                                            <th><FormattedMessage id="item.undertitle" /></th>
                                                            <th><FormattedMessage id="dueDate" /></th>
                                                            <th><FormattedMessage id="item.amount" /></th>
                                                            <th>
                                                                <IconButton size="small" color="action" disabled={!(items.findIndex(x => x.isUserCreation === true) > -1)} onClick={this.handleDeletePopper.bind(this)}>
                                                                    <Clear fontSize="inherit" />
                                                                </IconButton>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {

                                                            items.map((item, i) =>
                                                                item.id === this.state.loadingID ? (

                                                                    <tr key={item.id}>
                                                                        <td colSpan="5">
                                                                            <BlockUi blocking={true} style={{ maxHeight: '1.3rem' }}></BlockUi>
                                                                        </td>
                                                                    </tr>

                                                                ) : (
                                                                        <tr key={item.id}>
                                                                            <td>{item.ItemFlowStatus === "+" ? <FormattedMessage id="header.incomeExplanation" /> : <FormattedMessage id="header.outcomeExplanation" />}</td>
                                                                            <td>{lang === "tr" ? item.TurkishExplanation : item.EnglishExplanation}</td>
                                                                            <td>{moment(item.dueDate).format("DD-MM-YYYY")}</td>
                                                                            <td> {currencyType(item.currency).symbol}{localeAmountPrice(item.amount)}</td>
                                                                            <td><IconButton size="small" disabled={!item.isUserCreation} onClick={this.handleDeletePopperOnly.bind(this, item.id)}>
                                                                                <Clear fontSize="inherit" />
                                                                            </IconButton></td>
                                                                        </tr>
                                                                    )
                                                            )
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    )
                                }

                            </BlockUi>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}


Items.propTypes = {
    getIAlltemOfHeader: PropTypes.func,
    deleteItems: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
};
Items.defaultProps = {
    getIAlltemOfHeader: () => { }
};

const mapStateToProps = state => ({
    lang: state.locale.lang,
    itemAllOfHeaders: state.itemAllOfHeaders,
    deletedItemResult: state.deletedItemResult
});
const mapDispatchToProps = {
    getAllItemOfHeader,
    deleteItems
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(Items));







