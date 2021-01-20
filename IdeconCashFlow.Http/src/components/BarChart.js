import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BarChart as BarCharts, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import _ from 'lodash';
import ScrollArea from 'react-scrollbar';

import { localeAmountPrice } from '../utils/helper';

const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#60b2f9', '#d0271c', '#27919e', '#ea501f'
]


class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const { data, keys } = this.props;



        const color = keys.reduce((total, item, i) => {
            total.push(COLORS[i]);

            return total;
        }, []);

        if (_.isEmpty(data)) {
            return <></>
        }

        return (
            <ScrollArea
                speed={0.8}
                className="area"
                horizontal={false}
            >
                <BarCharts width={1200} height={400} data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={0} stroke='#000' />
                    {
                        keys.map((item, i) =>
                            <Bar dataKey={item} fill={color[i]} />
                        )
                    }
                </BarCharts>
            </ScrollArea>
        )
    }
}


BarChart.propTypes = {
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
)(BarChart);
