import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { currencyType, localeAmountPrice } from '../../utils/helper';
import { connect } from 'react-redux';



export function exchange(exchanges, to, from, price) {

    let response = '';
    if (exchanges.isLoaded) {
        const mainExchange = exchanges.data.response.mainExchange;
        const exchangeData = exchanges.data.response.exchanges;

        //kur değişiminde ana para türündeyse çarp yolla
        if (to.toLocaleUpperCase() === mainExchange.toLocaleUpperCase()) {
            const rate = exchangeData.find(x => x.key.toLocaleUpperCase() === from.toLocaleUpperCase()).value;

            response = rate * price;
        } else {
            const toRate = exchangeData.find(x => x.key.toLocaleUpperCase() === to.toLocaleUpperCase()).value;
            const fromRate = exchangeData.find(x => x.key.toLocaleUpperCase() === from.toLocaleUpperCase()).value;
            const rate = fromRate / toRate;

            response = rate * price;
        }
    }



    return response;
}


class Convert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        const { exchanges, to, from, price } = this.props;
        let response = exchange(exchanges, to, from, price);
        return (
            <>&nbsp;&nbsp;&nbsp;
           {"("}
                {currencyType(to.toLocaleUpperCase()).symbol}
                {localeAmountPrice(response)}
                )
          </>
        );
    }
}


Convert.propTypes = {
    exchanges: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
    exchanges: state.exchanges,
});

const mapDispatchToProps = {

};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Convert);
