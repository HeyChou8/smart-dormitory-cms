import React from 'react';
import ReactECharts from 'echarts-for-react';

const PowerSchedulePieChart = ({ powerSessions }) => {
    const totalMinutes = 24 * 60; // 一天共1440分钟

    let pieData = [];
    let lastEndMinute = 0;

    // 保证时间段按开始时间排序
    powerSessions.sort((a, b) => new Date(a.startTime).getHours() * 60 + new Date(a.startTime).getMinutes() - (new Date(b.startTime).getHours() * 60 + new Date(b.startTime).getMinutes())).forEach(session => {
        const startMinutes = new Date(session.startTime).getHours() * 60 + new Date(session.startTime).getMinutes();
        const endMinutes = new Date(session.endTime).getHours() * 60 + new Date(session.endTime).getMinutes();
        const durationMinutes = endMinutes - startMinutes;

        // 如果当前供电开始时间大于上一段供电的结束时间，说明有非供电时段
        if (startMinutes > lastEndMinute) {
            const nonPowerDuration = startMinutes - lastEndMinute;
            pieData.push({
                value: nonPowerDuration,
                name: `非供电时间: ${new Date(lastEndMinute * 60000).toISOString().substring(11, 16)} - ${new Date(startMinutes * 60000).toISOString().substring(11, 16)}`,
                itemStyle: { color: '#CCCCCC' }, // 灰色表示非供电时间
                tooltip: {
                    formatter: formatDuration(nonPowerDuration)
                }
            });
        }

        // 添加供电时间段
        pieData.push({
            value: durationMinutes,
            name: `供电时间: ${new Date(startMinutes * 60000).toISOString().substring(11, 16)} - ${new Date(endMinutes * 60000).toISOString().substring(11, 16)}`,
            itemStyle: { color: '#4CAF50' }, // 绿色表示供电时间
            tooltip: {
                formatter: formatDuration(durationMinutes)
            }
        });

        lastEndMinute = endMinutes;// 更新供电结束时间
    });

    // 如果最后一个供电结束时间小于一天的总时间，添加最后一个非供电时间段
    if (lastEndMinute < totalMinutes) {
        const nonPowerDuration = totalMinutes - lastEndMinute;
        pieData.push({
            value: nonPowerDuration,
            name: `非供电时间: ${new Date(lastEndMinute * 60000).toISOString().substring(11, 16)} - 00:00`,
            itemStyle: { color: '#CCCCCC' }, // 灰色表示非供电时间
            tooltip: {
                formatter: formatDuration(nonPowerDuration)
            }
        });
    }
    // 格式化时间显示，将分钟转换为小时和分钟的组合
    function formatDuration(minutes) {
        if (minutes < 60) {
            return `${minutes}分钟`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainderMinutes = minutes % 60;
            return `${hours}小时${remainderMinutes}分钟`;
        }
    }
    // 配置项设置
    const getOption = () => ({
        title: {
            text: '一天中的供电时间分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: params => `${params.data.name}: ${params.data.tooltip.formatter(params.data.value)} (${((params.data.value / totalMinutes) * 100).toFixed(2)}%)`
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: pieData.map(item => item.name)
        },
        series: [
            {
                name: '供电时间分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['60%', '50%'],
                startAngle: 90, // 从上午3点开始（90度）
                clockwise: true, // 顺时针方向
                data: pieData
            }
        ]
    });

    return <ReactECharts option={getOption()} style={{ height: '350px', width: '800px' }} />;
};

export default PowerSchedulePieChart;
