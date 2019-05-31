import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { getInputHeaders } from '../redux/modules/inputHeader'
import Table from '../components/Table';
import { currencyType } from '../utils/helper';
import FormField from '../components/common/FormField';
import { control } from '../utils/form';
import Preloader from '../components/common/PreLoader';
import ItemAddModal from '../components/ItemAddModal';

import { Button, Dialog, AppBar, Toolbar, IconButton,Icon, Typography, Slide} from "@material-ui/core/index";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class HeaderList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            inputHeaders: {},
            inputHeadersFetching: false,
            columns: [],
            totals: [],
            showColumns: [],
            pristine: false,
            open: false
        }
    }

    componentDidMount() {
        this.props.getInputHeaders();
    }

    componentDidUpdate() {
        if (!this.state.pristine && this.state.showColumns.length === 0 && this.state.inputHeaders.isLoaded) {
            this.setState({
                showColumns: this.state.columns
            })
        }
    }

    static getDerivedStateFromProps(nextProps) {
        const result = {};

        result.inputHeadersFetching = nextProps.inputHeaders.isFetching;
        if (nextProps.inputHeaders.isLoaded) {
            result.inputHeaders = nextProps.inputHeaders;

            if (nextProps.inputHeaders.data.response.headers) {
                result.columns = (nextProps.inputHeaders.data.response.headers[0].currencies).reduce((columns, currency, i) => {
                    columns.push({
                        value: currency.key,
                        label: currency.key.toLocaleUpperCase() + " (" + currencyType(currency.key.toLocaleUpperCase()).symbol + ")",
                    });
                    return columns;
                }, []);

                result.totals = nextProps.inputHeaders.data.response.totals;
            }
        }

        return { ...result };
    }

    getApiInputHeaders = (page = 1) => {
        this.setState({ page });
        this.props.getInputHeaders(page);
    }

    setShowTableColumns = columns => {

        if (!this.state.pristine) {
            this.setState({
                pristine: true
            });
        }

        // Gelen datayı alıp reduxa atacagım ordan geri sessiona gelecek zaten ekran tekrar yenilenmiş olacak.
        // this.props.setShowTableColumns(columns);

        return columns;
    }

    onTouch = value => {
        return value;
    }

    handleClickOpenCloseAddItem = () => {
        this.setState({
            open: !this.state.open
        })
    }

    render() {
        const { inputHeaders, columns, totals, showColumns, inputHeadersFetching, open } = this.state;
        return (
            <>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <Button variant="outlined" color="primary" onClick={() => this.handleClickOpenCloseAddItem()}>
                                Open full-screen dialog
                            </Button>
                            <Dialog
                                fullScreen
                                open={open}
                                onClose={this.handleClickOpenCloseAddItem}
                                TransitionComponent={Transition}
                            >
                                <AppBar style={{position:'relative'}}>
                                    <Toolbar>
                                        
                                        <Typography variant="h6" style={{flex:1}}>
                                            Kalem Ekleme
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
                                <ItemAddModal/>
                            </Dialog>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header header-elements-sm-inline">
                                <div className="col-sm-3">
                                    <h3 className="card-title"><FormattedMessage id="header.incomeoutcome" /></h3>
                                </div>
                                <div className="col-sm-9">
                                    <FormField
                                        type="select"
                                        closeMenuOnSelect={false}
                                        onChange={this.setShowTableColumns}
                                        options={columns}
                                        isMulti={true}
                                        removeSelected={this.state.showColumns}
                                        noOptionsMessage={() => 'Seçenek yok'}
                                        {...control(this, 'showColumns', this.setShowTableColumns)}
                                    />
                                </div>
                            </div>
                            <div className="header-elements"></div>
                            <div className="table-responsive">
                                <Preloader message="Sayfa Yükleniyor" loading={inputHeadersFetching} height="200px" />
                                {
                                    inputHeaders.isLoaded && (
                                        <Table data={inputHeaders.data.response.headers} columns={showColumns} totals={totals} />
                                    )
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </>
        )
    }
}


HeaderList.propTypes = {
    getInputHeaders: PropTypes.func.isRequired
};
HeaderList.defaultProps = {};

const mapStateToProps = state => ({
    inputHeaders: state.inputHeaders
});
const mapDispatchToProps = {
    getInputHeaders
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HeaderList);




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















                            