import React from 'react';
import ReactECharts from 'echarts-for-react';

const RepairSummaryStackedBarChart = ({ repairData }) => {
    const getOption = () => ({
        title: {
            text: '报修状态概览',
            left: 'center',
            top: '0%'  // 调整标题的顶部位置，避免与图表内容重叠
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['已维修', '未维修'],
            top: '12%'  // 将图例移动到标题下方，避免重叠
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '25%',  // 增加顶部空间，确保图例和标题不会被遮挡
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['报修总数']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '已维修',
                type: 'bar',
                stack: '总量',
                data: [repairData.fixed]
            },
            {
                name: '未维修',
                type: 'bar',
                stack: '总量',
                data: [repairData.unfixed]
            }
        ]
    });

    return <ReactECharts option={getOption()} style={{ height: '13.0208vw', width: '100%' }} />;
};

export default RepairSummaryStackedBarChart;
