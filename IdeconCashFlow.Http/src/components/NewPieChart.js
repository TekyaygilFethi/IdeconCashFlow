import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { PieChart as PieCharts, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { connect } from 'react-redux';
import _ from 'lodash';
import ScrollArea from 'react-scrollbar';
import BlockUi from 'react-block-ui';





class NewPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            insideData: [],
            outsideData: [],
            height: 400,
            width: 600,
            activeIndex: 0,
            isAnimation: false
        };

        this.onPieEnter = this.onPieEnter.bind(this);
    }

    componentDidMount() {

        const height = document.getElementById('tablerow').clientHeight < 500 ? 500 : document.getElementById('tablerow').clientHeight;
        const width = document.getElementById('chartrow').clientWidth;
        this.setState({ height, width });
    }

    componentDidUpdate() {

        const height = document.getElementById('tablerow').clientHeight < 500 ? 500 : document.getElementById('tablerow').clientHeight;
        const width = document.getElementById('chartrow').clientWidth;
        if (this.state.height !== height && this.state.width !== width) {
            this.setState({ height, width });
        }

    }

    componentWillMount() {
        if (!this.state.isAnimation) {
            this.setState({ isAnimation: !this.state.isAnimation })
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const result = {};
        result.loading = (nextProps.inputHeaders.isLoaded && nextProps.outputHeaders.isLoaded);
        if (nextProps.inputHeaders.isLoaded && nextProps.outputHeaders.isLoaded) {
            result.inTotalPieData = nextProps.inputHeaders.inTotalPieData
            result.incomePieData = nextProps.inputHeaders.incomePieData
            result.outTotalPieData = nextProps.outputHeaders.outTotalPieData
            result.outcomePieData = nextProps.outputHeaders.outcomePieData
        }

        return result;
    }


    onPieEnter(data, index) {
        this.setState({
            activeIndex: index,
        });
    }

    render() {
        const { intl } = this.props;
        const { loading, inTotalPieData, incomePieData, outTotalPieData, outcomePieData } = this.state;
        let inData = [];
        let outData = [];

        if (loading) {
            inData = [
                { text: intl.formatMessage({ id: "header.incomeExplanation" }), value: inTotalPieData, color: '#80be35', textColor: '#000' },
                { text: intl.formatMessage({ id: "header.outcomeExplanation" }), value: outTotalPieData, color: '#ee3124', textColor: '#fff' }
            ];

            outData = incomePieData.concat(outcomePieData)
        }


        return (
            <BlockUi blocking={!loading} className="my-auto" >
                {
                    loading && (
                        <ScrollArea
                            speed={0.8}
                            className=""
                            horizontal={false}
                        >
                            <PieCharts width={600} height={this.state.height}>
                                <Pie data={inData} dataKey="value" cx={this.state.width / 2} cy={this.state.height / 2} outerRadius={80} label={renderCustomizedInside} labelLine={false} isAnimationActive={true}>
                                    {
                                        inData.map((item, index) => <Cell key={index} fill={item.color} />)
                                    }
                                </Pie>
                                <Pie activeIndex={this.state.activeIndex}
                                    activeShape={renderActiveShape} paddingAngle={0.1} data={outData} dataKey="value" cx={this.state.width / 2} cy={this.state.height / 2} innerRadius={100} outerRadius={120} fill="#254099"
                                    onMouseEnter={this.onPieEnter}>
                                    {
                                        outData.map((item, index) => <Cell key={index} fill={item.color} />)
                                    }
                                </Pie>
                            </PieCharts>
                        </ScrollArea>
                    )
                }

            </BlockUi>
        )
    }
}

NewPieChart.propTypes = {
    lang: PropTypes.string.isRequired,
    exchanges: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
    lang: state.locale.lang,
    exchanges: state.exchanges,
    outputHeaders: state.outputHeaders,
    inputHeaders: state.inputHeaders,
});

const mapDispatchToProps = {

};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl(NewPieChart));



const RADIAN = Math.PI / 180;
const renderCustomizedInsid1e = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill={payload.textColor} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="cursor">
            {payload.text}
        </text>
    );
}
const renderCustomizedInside = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill={payload.textColor} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {payload.text}
        </text>
    );
};


const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle} s
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 3}
                outerRadius={outerRadius + 5}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${payload.text}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};