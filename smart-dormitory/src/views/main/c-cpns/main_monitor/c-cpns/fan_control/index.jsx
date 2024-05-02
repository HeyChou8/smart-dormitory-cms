import React, { useState } from 'react';
import axios from 'axios';
import { Switch, Card, Typography } from 'antd';
import {ChromeOutlined } from '@ant-design/icons'; // 假设这是风扇的图标
import { BASE_URL } from '@/service/request/config'
import { throttle } from '@/utils/throttle';
const FanControl = () => {
  const [isFanOn, setIsFanOn] = useState(false); // 控制风扇状态的状态变量

  const toggleFan = throttle(async () => {
    const action = isFanOn ? 'off' : 'on';
    try {
      const res = await axios.get(`${BASE_URL}/monitor/fanControl/${action}`)
      setIsFanOn(!isFanOn);
      console.log(res.data)
    } catch (error) {
      console.error(error);
    }
  },3000)

  return (
    <Card bordered={true} style={{ width: '19.5313vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography.Title level={4} style={{ color: 'rgba(1, 1, 1, 0.79)' }}>风扇控制</Typography.Title>
      <ChromeOutlined style={{ fontSize: '1.5625vw', color: isFanOn ? '#1890ff' : '#8c8c8c', marginBottom: '0.651vw',marginLeft:'0.1302vw' }}/>
      <Switch 
        checkedChildren="开" 
        unCheckedChildren="关" 
        checked={isFanOn} 
        onClick={toggleFan} 
        style={{marginBottom:'0.651vw',marginLeft:'0.3255vw'}}
      />
    </Card>
  );
};

export default FanControl;
