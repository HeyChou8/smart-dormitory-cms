import React from 'react';
import ReactECharts from 'echarts-for-react';

const UserTypePieChart = ({ userData }) => {
    const getOption = () => ({
        title: {
            text: '用户类型分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: userData.map(item => item.name)
        },
        series: [
            {
                name: '用户类型',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: userData,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    });

    return <ReactECharts option={getOption()} style={{ height: '13.0208vw', width: '100%' }} />;
};

export default UserTypePieChart;
