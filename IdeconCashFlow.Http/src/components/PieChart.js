import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { PieChart as PieCharts, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { connect } from 'react-redux';
import _ from 'lodash';
import ScrollArea from 'react-scrollbar';



let percentUnit = 0;
let percentRate = 0;
const increasingUnit = 10;

let increment1 = 2;
let increment2 = 2;
let increment3 = 2;
let increment4 = 2;
let increment5 = 2;
let increment6 = 2;
let increment7 = 2;
let increment8 = 2;
let increment9 = 2;
let increment10 = 2;

const RADIAN = Math.PI / 180;
const renderCustomizedInside = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill={payload.textColor} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="cursor">
            {payload.text}
        </text>
    );
}



class PieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            insideData: [],
            outsideData: [],
            height: 400,
        };

        this.comparator = this.comparator.bind(this);
        this.rearrangeArray = this.rearrangeArray.bind(this);
    }

    componentDidMount() {

        const height = document.getElementById('header-table').clientHeight;
        this.setState({ height });
    }


    comparator(a, b) {
        const exchangeData = this.props.exchanges.data.response.exchanges;
        const mainExchange = this.props.exchanges.data.response.mainExchange;


        let aTotal = a.currencies.reduce((total, item, i) => {
            if (item.key.toLocaleUpperCase() !== mainExchange) {
                const rate = exchangeData.find(x => x.key.toLocaleUpperCase() === item.key.toLocaleUpperCase()).value;
                total = total + rate * Math.abs(item.value);
            } else {
                total = total + Math.abs(item.value);
            }
            return total
        }, 0)

        let bTotal = b.currencies.reduce((total, item, i) => {
            if (item.key.toLocaleUpperCase() !== mainExchange) {
                const rate = exchangeData.find(x => x.key.toLocaleUpperCase() === item.key.toLocaleUpperCase()).value;
                total = total + rate * Math.abs(item.value);
            } else {
                total = total + Math.abs(item.value);
            }
            return total
        }, 0)


        if (aTotal < bTotal) return -1;
        if (aTotal > bTotal) return 1;
        return 0;
    }


    rearrangeArray(array) {
        let newArray = [];
        const cloneArray = JSON.parse(JSON.stringify(array))
        cloneArray.sort(this.comparator);
        let n = cloneArray.length;
        let ArrIndex = 0;

        for (let i = 0, j = n - 1; i <= n / 2
            || j > n / 2; i++ , j--) {

            if (ArrIndex < n) {
                newArray[ArrIndex] = cloneArray[i];
                ArrIndex++;
            }

            if (ArrIndex < n) {
                newArray[ArrIndex] = cloneArray[j];
                ArrIndex++;
            }
        }


        return newArray;
    }

    render() {
        percentRate = 0;
        percentUnit = 0;
        increment1 = 2;
        increment2 = 2;
        increment3 = 2;
        increment4 = 2;
        increment5 = 2;
        increment6 = 2;
        increment7 = 2;
        increment8 = 2;
        increment9 = 2;
        increment10 = 2;
        const { intl } = this.props;
        const { insideDataInCome, insideDataOutCome, outsideData, exchanges } = this.props;
        let inData = null;
        let outData = [];

        if (exchanges.isLoaded) {
            let insideDataTotal = 0;
            let outsideDataTotal = 0;

            const mainExchange = exchanges.data.response.mainExchange;
            const exchangeData = exchanges.data.response.exchanges;


            if (!_.isEmpty(insideDataInCome)) {

                insideDataTotal = insideDataInCome.reduce((total, item, index) => {

                    if (item.key.toLocaleUpperCase() !== mainExchange) {
                        const rate = exchangeData.find(x => x.key.toLocaleUpperCase() === item.key.toLocaleUpperCase()).value;
                        total = total + rate * Math.abs(item.value);
                    } else {
                        total = total + Math.abs(item.value);
                    }

                    return total;
                }, 0)


                insideDataInCome.map((item, i) => {
                    const mainExchange = exchanges.data.response.mainExchange;
                    const exchangeData = exchanges.data.response.exchanges;
                    if (item.key.toLocaleUpperCase() !== mainExchange) {
                        const rate = exchangeData.find(x => x.key.toLocaleUpperCase() === item.key.toLocaleUpperCase()).value;
                        insideDataTotal = insideDataTotal + rate * Math.abs(item.value);
                    } else {
                        insideDataTotal = insideDataTotal + Math.abs(item.value);
                    }
                });
            }

            if (!_.isEmpty(insideDataOutCome)) {

                outsideDataTotal = insideDataOutCome.reduce((total, item, index) => {

                    if (item.key.toLocaleUpperCase() !== mainExchange) {
                        const rate = exchangeData.find(x => x.key.toLocaleUpperCase() === item.key.toLocaleUpperCase()).value;
                        total = total + rate * Math.abs(item.value);
                    } else {
                        total = total + Math.abs(item.value);
                    }

                    return total;
                }, 0)


                insideDataOutCome.map((item, i) => {


                    if (item.key.toLocaleUpperCase() !== mainExchange) {
                        const rate = exchangeData.find(x => x.key.toLocaleUpperCase() === item.key.toLocaleUpperCase()).value;
                        outsideDataTotal = outsideDataTotal + rate * Math.abs(item.value);
                    } else {
                        outsideDataTotal = outsideDataTotal + Math.abs(item.value);
                    }
                });


            }

            inData = [
                { text: intl.formatMessage({ id: "header.incomeExplanation" }), value: insideDataTotal, color: '#80be35', textColor: '#000' },
                { text: intl.formatMessage({ id: "header.outcomeExplanation" }), value: outsideDataTotal, color: '#ee3124', textColor: '#fff' }
            ];


            if (!_.isEmpty(outsideData)) {

                // outData = outsideData.income.reduce((total, content, i) => {
                //     let dataTotal = content.currencies.reduce((contentTotal, item, j) => {
                //         if (item.key.toLocaleUpperCase() !== mainExchange) {
                //             const rate = exchangeData.find(x => x.key.toLocaleUpperCase() === item.key.toLocaleUpperCase()).value;
                //             contentTotal = contentTotal + rate * Math.abs(item.value);
                //         } else {
                //             contentTotal = contentTotal + Math.abs(item.value);
                //         }

                //         return contentTotal;
                //     }, 0)

                //     total.push({ text: content.title, value: dataTotal })

                //     return total;
                // }, [])

                outsideData.income = this.rearrangeArray(outsideData.income)
                outsideData.income.map((content, i) => {
                    let dataTotal = 0;
                    content.currencies.map((item, j) => {
                        if (item.key.toLocaleUpperCase() !== mainExchange) {
                            const rate = exchangeData.find(x => x.key.toLocaleUpperCase() === item.key.toLocaleUpperCase()).value;
                            dataTotal = dataTotal + rate * Math.abs(item.value);
                        } else {
                            dataTotal = dataTotal + Math.abs(item.value);
                        }
                    })

                    outData.push({ id: content.id, text: intl.formatMessage({ id: content.id, defaultMessage: content.title }), value: dataTotal, color: '#80be35' })
                })

                outsideData.outcome.map((content, i) => {
                    let dataTotal = 0;
                    content.currencies.map((item, j) => {
                        if (item.key.toLocaleUpperCase() !== mainExchange) {
                            const rate = exchangeData.find(x => x.key.toLocaleUpperCase() === item.key.toLocaleUpperCase()).value;
                            dataTotal = dataTotal + rate * Math.abs(item.value);
                        } else {
                            dataTotal = dataTotal + Math.abs(item.value);
                        }
                    })
                    outData.push({ id: content.id, text: intl.formatMessage({ id: content.id, defaultMessage: content.title }), value: dataTotal, color: '#ee3124' })
                })
            }

        }

        let incomePie = <></>;
        let outcomePie = <></>;

        if (inData) {
            incomePie = <Pie data={inData} dataKey="value" cx={280} cy={220} outerRadius={60} label={renderCustomizedInside} labelLine={false} isAnimationActive={true}>
                {
                    inData.map((item, index) => <Cell key={index} fill={item.color} />)
                }
            </Pie>
        }

        if (outData) {
            outcomePie = <Pie data={outData} dataKey="value" cx={280} cy={220} innerRadius={70} outerRadius={90} fill="#254099" isAnimationActive={false}
                label={renderCustomizedOutside} labelLine={false}>
                {
                    outData.map((item, index) => <Cell key={index} fill={item.color} />)
                }
            </Pie>
        }

        return (
            <div className="my-auto">
                {
                    exchanges.isLoaded ? (
                        <ScrollArea
                            speed={0.8}
                            className="area"
                            horizontal={false}
                        >
                            <PieCharts width={800} height={700}>
                                {incomePie}
                                {outcomePie}
                            </PieCharts>
                        </ScrollArea>
                    ) : (
                            <p className="text-center">Önizleme yapılamıyor.</p>
                        )
                }

            </div>
        )
    }
}


PieChart.propTypes = {
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
)(injectIntl(PieChart));



const renderCustomizedOutside = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }) => {
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    percentUnit = (percent * 100)
    percentRate = percentRate + percentUnit;
    let my = 0
    let mx = 0
    let ex = 0
    switch (true) {
        case percentUnit < 1 && percentRate < 20:
            my = cy + (outerRadius + 30) * sin - (30 * increment1);
            mx = cx + (outerRadius + 30) * cos;
            ex = 60 + mx + (cos >= 0 ? 1 : -1) * 22;
            increment1 = increment1 + 1
            break;
        case percentUnit < 1 && percentRate < 40:
            my = (-8 * increment2) + cy + (outerRadius + 30) * sin;
            mx = cx + (outerRadius + 30) * cos;
            ex = 60 + mx + (cos >= 0 ? 1 : -1) * 22;
            increment2 = increment2 + 5
            break;
        case percentUnit < 1 && percentRate < 60:
            my = (-10 * increment3) + cy + (outerRadius + 30) * sin;
            mx = cx + (outerRadius + 30) * cos;
            ex = 60 + mx + (cos >= 0 ? 1 : -1) * 22;
            increment3 = increment3 + 3
            break;
        case percentUnit < 1 && percentRate < 80:
            my = (-8 * increment4) + cy + (outerRadius + 30) * sin;
            mx = cx + (outerRadius + 30) * cos;
            ex = 60 + mx + (cos >= 0 ? 1 : -1) * 22;
            increment4 = increment4 + 2
            break;
        case percentUnit < 1 && percentRate < 100:
            my = (-8 * increment5) + cy + (outerRadius + 30) * sin;
            mx = cx + (outerRadius + 30) * cos;
            ex = 60 + mx + (cos >= 0 ? 1 : -1) * 22;
            increment5 = increment5 + 2
            break;
        case percentRate < 20:
            my = cy + (outerRadius + 30) * sin - (20 * increment1);
            mx = cx + (outerRadius + 30) * cos;
            ex = 60 + mx + (cos >= 0 ? 1 : -1) * 22;
            increment6 = increment6 + 2
            break;
        case percentRate < 40:
            my = (8 * increment7) + cy + (outerRadius + 30) * sin;
            mx = cx + (outerRadius + 30) * cos;
            ex = 60 + mx + (cos >= 0 ? 1 : -1) * 22;
            increment7 = increment7 + 5
            break;
        case percentRate < 60:
            my = (-8 * increment8) + cy + (outerRadius + 30) * sin;
            mx = cx + (outerRadius + 30) * cos;
            ex = 60 + mx + (cos >= 0 ? 1 : -1) * 22;
            increment8 = increment8 + 2
            break;
        case percentRate < 80:
            my = (8 * increment9) + cy + (outerRadius + 30) * sin;
            mx = cx + (outerRadius + 30) * cos;
            ex = 60 + mx + (cos >= 0 ? 1 : -1) * 22;
            increment9 = increment9 + 2
            break;
        case percentRate < 100:
            my = (8 * increment10) + cy + (outerRadius + 30) * sin;
            mx = cx + (outerRadius + 30) * cos;
            ex = -60 + mx + (cos >= 0 ? 1 : -1) * 22;
            increment10 = increment10 + 2
            break;
        default:
            my = cy + (outerRadius + 30) * sin;
            mx = cx + (outerRadius + 30) * cos;
            break;
    }
    if (ex === 0)
        ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;


    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    return (
        <g>                                                      {/* #333" */}
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke="#333" fill="none" />
            <circle cx={ex} cy={ey} r={2} stroke="none" />                                         {/* #254099" */}
            <text className="detailTotal" x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={payload.color}> {payload.text}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={9} textAnchor={textAnchor} fill="#999" fontSize="9px">
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};