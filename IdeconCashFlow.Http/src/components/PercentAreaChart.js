import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { connect } from 'react-redux';
import _ from 'lodash';
import ScrollArea from 'react-scrollbar';

import { localeAmountPrice } from '../utils/helper';

const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#60b2f9', '#d0271c', '#27919e', '#ea501f'
]

const getPercent = (value, total) => {
    const ratio = total > 0 ? value / total : 0;

    return toPercent(ratio, 2);
};

const toPercent = (decimal, fixed = 0) => {
    return `${(decimal * 100).toFixed(fixed)}%`;
};

const renderTooltipContent = (o) => {
    const { payload, label } = o;
    const total = payload.reduce((result, entry) => (result + entry.value), 0);
    return (
        <div className="customized-tooltip-content">
            {/* <p className="total">{`${label} (Total: ${total})`}</p> */}
            <ul className="list">
                {
                    payload.map((entry, index) => (
                        <li key={`item-${index}`} style={{ color: entry.color }}>
                            {`${entry.name}: ${localeAmountPrice(entry.payload["true" + entry.dataKey])}(${getPercent(entry.value, total)})`}
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

class PercentAreaChart extends Component {
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
                <AreaChart width={1200} height={400} data={data} stackOffset="expand"
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }} >
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={toPercent} />
                    <Tooltip content={renderTooltipContent} />
                    {
                        keys.map((item, i) =>
                            <Area key={i} type='monotone' dataKey={item} stackId="1" stroke={color[i]} fill={color[i]} isAnimationActive={true} />
                        )
                    }
                </AreaChart>
            </ScrollArea>
        )
    }
}


PercentAreaChart.propTypes = {
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
)(PercentAreaChart);
