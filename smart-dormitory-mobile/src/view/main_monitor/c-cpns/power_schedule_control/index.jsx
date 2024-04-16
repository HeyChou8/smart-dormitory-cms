
  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { Card, Switch, Typography, Modal, message, Badge, DatePicker } from 'antd';
  import { PoweroffOutlined } from '@ant-design/icons';
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  import locale from 'antd/es/date-picker/locale/zh_CN';
  import {BASE_URL} from '../../../../config'
  import '../../../../assets/common.css'
  moment.locale('zh-cn');

  const { RangePicker } = DatePicker;

  const PowerScheduleControl = () => {
    // 定义组件状态
    const [isPowerOn, setIsPowerOn] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDateTimeRange, setSelectedDateTimeRange] = useState([]);
    const [dateTimeRangeValue, setDateTimeRangeValue] = useState(null);
    const [status, setStatus] = useState('default');
    const [scheduledTimeText, setScheduledTimeText] = useState('');
    const [timerId, setTimerId] = useState(null);
    // 组件挂载后定期查询电源状态
    useEffect(() => {
      const interval = setInterval(() => {
        fetchPowerStatus();
      }, 5000);

      return () => {
        clearInterval(interval)
        if (timerId) {
          clearTimeout(timerId);
        }
      }
      
    }, [timerId]);
    // 查询电源状态
    const fetchPowerStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/monitor/power/status`);
        if (response.status === 200) {
          setIsPowerOn(response.data.isPowerOn);
          setStatus(response.data.isPowerOn ? 'success' : 'default');
        }
      } catch (error) {
        console.error('查询电源状态失败', error);
      }
    };
    // 切换电源状态
    const togglePower = async () => {
      if (!isPowerOn) {
        setIsModalVisible(true);
      } else {
        setStatus('processing');
        try {
          const response = await axios.post(`${BASE_URL}/monitor/power/off`);
          if (response.status === 200) {
            message.success('关闭定时');
            setIsPowerOn(false);
            setStatus('default');
          }
        } catch (error) {
          message.error('关闭定时失败');
          setStatus('error');
        }
      }
    };
     // 处理模态框取消操作
    const handleCancel = () => {
      setIsModalVisible(false);
      setDateTimeRangeValue(null);
      setSelectedDateTimeRange([]); // 重置 selectedDateTimeRange 状态
    }
    // 处理日期时间范围变化
    const handleDateTimeRangeChange = (values) => {
      setSelectedDateTimeRange(values);
      setDateTimeRangeValue(values);
    };
    // 处理定时任务设置
    const handleSchedule = async () => {
      if (selectedDateTimeRange.length < 2) {
        message.error('请选择有效的开始和结束日期及时间');
        return;
      }

      const schedule = {
        startTime: selectedDateTimeRange[0].toISOString(),
        endTime: selectedDateTimeRange[1].toISOString(),
      };

      setStatus('processing');
      try {
        const scheduleResponse = await axios.post(`${BASE_URL}/monitor/power/schedule`, schedule);
        if (scheduleResponse.status === 200) {
          const powerOnResponse = await axios.post(`${BASE_URL}/monitor/power/on`);
          if (powerOnResponse.status === 200) {
            message.success('设置成功');
            setIsPowerOn(true);
            setStatus('success');
          }
        }
      } catch (error) {
        message.error('定时设置失败');
        setStatus('error');
      } finally {
        setIsModalVisible(false);
        setDateTimeRangeValue(null);
      }
      // 在这里更新卡片上显示的定时时间范围文本
    const startTimeText = selectedDateTimeRange[0].format('YYYY-MM-DD HH:mm');
    const endTimeText = selectedDateTimeRange[1].format('YYYY-MM-DD HH:mm');
    setScheduledTimeText(`定时：${startTimeText} - ${endTimeText}`);
    // 定义一个定时器，在定时结束时清除显示的文本
    const duration = selectedDateTimeRange[1].diff(moment());
    if (timerId) {
      clearTimeout(timerId); // 清除旧的定时器
    }
    const newTimerId = setTimeout(() => {
      setScheduledTimeText('');
    }, duration);
    setTimerId(newTimerId); // 保存新的定时器ID
    };
    
  
    // 渲染组件界面
    return (
      <Card bordered={true} style={{ width: '19.5313vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography.Title level={4} style={{ color: 'rgba(1, 1, 1, 0.79)' }}>定时供电</Typography.Title>
        <Badge status={status} dot>
          <PoweroffOutlined style={{ fontSize: '1.5625vw', color: isPowerOn ? '#52c41a' : '#8c8c8c', marginBottom: '0.651vw',marginLeft:'0.1953vw'}} />
        </Badge>
        <Switch checkedChildren="开" unCheckedChildren="关" checked={isPowerOn} onClick={togglePower} style={{marginLeft:'0.3255vw',marginBottom:'0.651vw'}}/>
        <Modal className="custom-modal"
          title="选择开始和结束日期及时间"
          visible={isModalVisible}
          onCancel={handleCancel}
          onOk={handleSchedule}
          okText="确定"
          cancelText="取消"
        >
          <RangePicker  className="custom-range-picker"
            value={dateTimeRangeValue}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={handleDateTimeRangeChange}
            locale={locale}
            disabledDate={(current) => current && current < moment().startOf('day')}
            size='small'
          />
        </Modal>
        {scheduledTimeText && (
        <Typography.Paragraph style={{ textAlign: 'center' }}>
          {scheduledTimeText}
        </Typography.Paragraph>
      )}
      </Card>
    );
  };

  export default PowerScheduleControl;

