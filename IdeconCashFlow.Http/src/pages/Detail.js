import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { currencyType, localeAmountPrice } from '../utils/helper';
import { getDetail } from '../redux/modules/getDetail'
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBackTwoTone';

class Detail extends Component {
    constructor(props) {
        super(props);
        this.state ={
            details:[],
            id:null,
            startDate:null,
            viewtType:null,
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        let startDate = this.props.match.params.startDate;
        let viewType = this.props.match.params.viewType;
        const data = {
            'AnaBaslikID':id,
            'BaslangicTarihi':startDate,
            'FilterType':viewType
        };
        this.props.getDetail(data);
        
        this.setState({id,startDate,viewType});
    }

    static getDerivedStateFromProps(nextProps) {
        const result = {};
        let commonList = {};

        if (nextProps.details.isLoaded) {            
            result.details = nextProps.details;

            nextProps.details.data.response.getDetail.map((detail,i)=>
                detail.ParaBirimiTutarlar.map((currency,j)=>
                commonList[detail.VadeTarihi+detail.AnaBaslikID+currency.ParaBirimi] = currency.Tutar
                )            
            )

            result.commonList = commonList;

            result.columns = (nextProps.details.data.response.getDetail).reduce((columns, detail, i) => { 
                if(columns.find(x=>x.value===detail.VadeTarihi)===undefined){
                    columns.push({
                        value: detail.VadeTarihi,
                        label: detail.VadeTarihi
                    });
                }
                return columns;
            }, []);

            result.titleTypes = (nextProps.details.data.response.getDetail).reduce((columns, detail, i) => {
                if(columns.find(x=>x.value===detail.AnaBaslikID)===undefined){
                    columns.push({
                        value: detail.AnaBaslikID,
                        label: detail.AnaBaslikTanim
                    });                   
                }
                return columns;
            }, []);

            result.totals = nextProps.details.data.response.totals;

            if(nextProps.details.data.response.getDetail.length>0){
                result.currencies = (nextProps.details.data.response.getDetail[0].ParaBirimiTutarlar).reduce((columns, currency, i) => {
                    columns.push({
                        value: currency.ParaBirimi,
                        label: currency.ParaBirimi
                    });
                    return columns;
                }, []);
            }

        }
        return { ...result };
    }


    goBack(){
        this.props.history.goBack();
    }

    render() {
        const {details , columns,titleTypes,currencies,commonList,totals} = this.state;        
        return (
            <>   
            <div className="row">
                <div className="col-xl-12">
                    <Button color="primary" onClick={()=>this.goBack()}>
                        <BackIcon></BackIcon> <FormattedMessage id="goBack"/>
                    </Button>
                </div>
            </div>
                <div className="row">    
                    <div className="col-xl-12">
                    <div className="card">
                      
                  <div className="card-body d-sm-flex align-items-sm-center justify-content-sm-left flex-sm-wrap" style={{overflowX:'scroll',overflowY:'hidden'}}>
                      {
                          details.isLoaded && (
                            <table className="table text-nowrap table-bordered" >
                                <thead>
                                    <tr>
                                        <th>Tanım</th>
                                        <th>Para birimi</th>
                                        {
                                            columns.map((item, i) =>
                                                <th key={i}>{item.label}</th>
                                            )
                                        }
                                        <th>Toplam</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        titleTypes.map((title, i) =>
                                            currencies.map((currency,j)=>
                                                <tr>
                                                    {
                                                      j===0&&(
                                                        <th scope="col" className="align-middle" rowSpan={currencies.length}>
                                                            {title.label}
                                                        </th>
                                                      )  
                                                    }                                                  
                                                    <th scope="col">
                                                        {currency.label}
                                                    </th>

                                                    {
                                                        columns.map((item, k) =>
                                                            <td className={commonList[item.value+title.value+currency.value]>0?'text-success':'text-danger'}>
                                                                {
                                                                    currencyType(currency.label).symbol + 
                                                                    localeAmountPrice(commonList[item.value+title.value+currency.value])
                                                                }
                                                            </td>
                                                        )
                                                    }
                                                    <td className={totals.find(x=>x.AnaBaslikID === title.value && x.ParaBirimi === currency.label).ToplamTutar>0?'text-success font-weight-bold':'text-danger font-weight-bold'}>
                                                        {
                                                            currencyType(currency.label).symbol       +                                                     
                                                            totals.find(x=>x.AnaBaslikID === title.value && x.ParaBirimi === currency.label).ToplamTutar                                    
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    }
                                </tbody>
                            </table>        
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


Detail.propTypes = {
    getDetail:PropTypes.func.isRequired
};
Detail.defaultProps = {};

const mapStateToProps = state => ({
    details : state.details
});
const mapDispatchToProps = {
    getDetail
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Detail);




