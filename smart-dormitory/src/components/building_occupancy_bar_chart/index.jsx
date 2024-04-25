import React from 'react';
import ReactECharts from 'echarts-for-react';

const BuildingOccupancyBarChart = ({ occupancyData }) => {
    const getOption = () => ({
        title: {
            text: '各栋楼居住人数统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: occupancyData.map(item => item.name),
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value',
            minInterval: 1 // 确保y轴刻度为整数
        },
        series: [
            {
                name: '人数',
                type: 'bar',
                barWidth: '60%',
                data: occupancyData.map(item => ({ value: item.value, name: item.name }))
            }
        ]
    });

    return <ReactECharts option={getOption()} style={{ height: '13.0208vw', width: '100%' }} />;
};

export default BuildingOccupancyBarChart;
