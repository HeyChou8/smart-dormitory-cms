
  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { Card, Switch, Typography, Modal, message, Badge, DatePicker } from 'antd';
  import { PoweroffOutlined } from '@ant-design/icons';
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  import locale from 'antd/es/date-picker/locale/zh_CN';
  import {BASE_URL} from '@/service/request/config'
import { localCache } from '@/utils/cache.ts';
  moment.locale('zh-cn');

  const { RangePicker } = DatePicker;
  // 当午夜12点之后情况供电统计时间段
  const clearMidnight = () => {
    // 获取当前时间
    const now = new Date();
    // 计算当前时间到第二天午夜的时间间隔
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const delay = midnight.getTime() - now.getTime();
  
    // 设置一次性定时器
    setTimeout(() => {
      localCache.setCache('scheduleArr', []);  // 清空缓存
      console.log('Cache cleared at midnight.');
      clearMidnight(); // 定时器触发后再次设置，实现每日重置
    }, delay);
  };
  const PowerScheduleControl = () => {
    // 初始化状态时尝试从 localStorage 获取状态
  const initialPowerOn = localCache.getCache('isPowerOn') || false;
  const savedScheduledTimeText = localStorage.getItem('scheduledTimeText')
  const initialScheduledTimeText = savedScheduledTimeText ? JSON.parse(savedScheduledTimeText) : ''

    // 定义组件状态
    const [isPowerOn, setIsPowerOn] = useState(initialPowerOn);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDateTimeRange, setSelectedDateTimeRange] = useState([]);
    const [dateTimeRangeValue, setDateTimeRangeValue] = useState(null);
    const [status, setStatus] = useState('default');
    const [scheduledTimeText, setScheduledTimeText] = useState(initialScheduledTimeText);
    const [timerId, setTimerId] = useState(null);
    useEffect(() => {
      if (selectedDateTimeRange.length === 2) {
        const endTime = selectedDateTimeRange[1].toISOString();
        localStorage.setItem('scheduledEndTime', endTime); // 保存定时器的到期时间到 localStorage
      }
    }, [selectedDateTimeRange])
    useEffect(() => {
      // 当设置完之后切换到其他页面或者刷新导致组件重新挂载会执行这个
      // 当组件挂载时，检查 localStorage 中是否有定时器的到期时间
      const endTime = localStorage.getItem('scheduledEndTime');
      if (endTime && new Date(endTime) > new Date()) {
        // 如果存在定时器到期时间，并且还未到期，则设置定时器
        const timeout = new Date(endTime).getTime() - new Date().getTime();
        const timerId = setTimeout(() => {
          setScheduledTimeText('');
          localStorage.removeItem('scheduledEndTime'); // 定时器触发后清除存储的到期时间
        }, timeout);
        setTimerId(timerId);
      }
      clearMidnight();  // 调用函数设置定时器，在午夜12点之后清空本地时间段缓存
    }, [])
    // 组件挂载后定期查询电源状态
    useEffect(() => {
      const interval = setInterval(() => {
        fetchPowerStatus();
      }, 3000);

      return () => {
        clearInterval(interval)
        if (timerId) {
          clearTimeout(timerId);
        }
      }
      
    }, [timerId]);
    useEffect(() => {
      localStorage.setItem('isPowerOn', JSON.stringify(isPowerOn));
      localStorage.setItem('scheduledTimeText', JSON.stringify(scheduledTimeText));
    }, [isPowerOn, scheduledTimeText]);
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
      setIsPowerOn(false); // 设置开关为关闭状态
      setStatus('default'); // 设置状态为默认
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
      }
      const scheduleArr = localCache.getCache('scheduleArr') || []
      scheduleArr.push(schedule)
      localCache.setCache('scheduleArr',scheduleArr)
      setStatus('processing')
      try {
        const scheduleResponse = await axios.post(`${BASE_URL}/monitor/power/schedule`, schedule)
        if (scheduleResponse.status === 200) {
          const powerOnResponse = await axios.post(`${BASE_URL}/monitor/power/on`)
          if (powerOnResponse.status === 200) {
            message.success('设置成功')
            setIsPowerOn(true)
            setStatus('success')
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
    // // 定义一个定时器，在定时结束时清除显示的文本
    // 当设置完后停留在此页面时会执行这个
    const duration = selectedDateTimeRange[1].diff(moment());
    if (timerId) {
      clearTimeout(timerId); // 清除旧的定时器
    }
    const newTimerId = setTimeout(() => {
      setScheduledTimeText('');
      // console.log(scheduledTimeText)
    }, duration);
    setTimerId(newTimerId); // 保存新的定时器ID
    }

    // 渲染组件界面
    return (
      <div>
        <Card bordered={true} style={{ width: '19.5313vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography.Title level={4} style={{ color: 'rgba(1, 1, 1, 0.79)' }}>定时供电</Typography.Title>
        <Badge status={status} dot>
          <PoweroffOutlined style={{ fontSize: '1.5625vw', color: isPowerOn ? '#52c41a' : '#8c8c8c', marginBottom: '0.651vw',marginLeft:'0.1953vw'}} />
        </Badge>
        <Switch checkedChildren="开" unCheckedChildren="关" checked={isPowerOn} onClick={togglePower} style={{marginLeft:'0.3255vw',marginBottom:'0.651vw'}}/>
        <Modal
          title="选择开始和结束日期及时间"
          visible={isModalVisible}
          onCancel={handleCancel}
          onOk={handleSchedule}
          okText="确定"
          cancelText="取消"
        >
          <RangePicker
            value={dateTimeRangeValue}
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={handleDateTimeRangeChange}
            locale={locale}
            disabledDate={(current) => current && current < moment().startOf('day')}
          />
        </Modal>
        {scheduledTimeText && (
        <Typography.Paragraph style={{ textAlign: 'center' }}>
          {scheduledTimeText}
        </Typography.Paragraph>
      )}
      </Card>
      </div>
    );
  };

  export default PowerScheduleControl;

