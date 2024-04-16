import React, { useState } from 'react';
import axios from 'axios';
import { Switch, Card, Typography } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { BASE_URL } from '../../../../config/index';
const LightControl = ()=>{
  const [isLightOn, setIsLightOn] = useState(false);
    // 转换灯光
  const toggleLight = async () => {
    const action = isLightOn ? 'off' : 'on';
    try {
      const res = await axios.get(`${BASE_URL}/monitor/lightControl/${action}`);
      setIsLightOn(!isLightOn);
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <Card bordered={true} style={{ width: '19.5313vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography.Title level={4} style={{ color: 'rgba(1, 1, 1, 0.79)' }}>灯光控制</Typography.Title>
      <BulbOutlined style={{ fontSize: '1.5625vw', color: isLightOn ? '#fadb14' : '#8c8c8c', marginBottom: '0.651vw',marginLeft:'0.0651vw' }} />
      <Switch 
        checkedChildren="开" 
        unCheckedChildren="关" 
        checked={isLightOn} 
        onClick={toggleLight} 
        style={{marginBottom:'0.651vw',marginLeft:'0.3255vw'}}
      />
    </Card>
  );
}

export default LightControl;
