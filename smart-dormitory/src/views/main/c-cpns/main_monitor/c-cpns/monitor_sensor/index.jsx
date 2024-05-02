import React, { useState, useEffect, memo,useRef  } from 'react';
import { Card, Statistic, Row, Col, Modal, Input, Button, message } from 'antd';
import { FireOutlined, CloudOutlined, UserOutlined,EnvironmentOutlined} from '@ant-design/icons';
import UseMainStore from '../../../../../../store/main';
import { WS_BASE_URL } from '@/service/request/config';
import {BASE_URL} from '@/service/request/config'
import axios from 'axios';
const MonitorSensor = memo(() => {
  const [data, setData] = useState({ temperature: 0, humidity: 0, presence: false, gas:0 });
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [gasThreshold,setGasThreshold] = useState(700)
  const {changeTemPresenceAction} = UseMainStore()
  // useRef 钩子来存储函数的引用，并在组件的生命周期中只创建一次
  const checkGasValueRef = useRef(null);




const lastGasValueRef = useRef(data.gas); // 存储上一次的烟雾值

// 将函数存入ref
checkGasValueRef.current = () => {
  if (Math.abs(data.gas - lastGasValueRef.current) > 300) { // 只有当烟雾值变化超过200 ppm时才调用
    checkGasValue(data.gas);
    lastGasValueRef.current = data.gas; // 更新存储的烟雾值
  }
} 

  useEffect(() => {
    // 当 data.gas 更新时，调用函数
    if (checkGasValueRef.current) {
      checkGasValueRef.current();
    }
  }, [data.gas]);
  useEffect(() => {
    // 监听8002端口
    const ws = new WebSocket(WS_BASE_URL);

    ws.onopen = () => {
      console.log('WebSocket 开启');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { temperature, humidity, presence,gas } = message;
      const sensorData = { temperature, humidity, presence,gas };
      setData(prevData => {
        const newData = { ...prevData, temperature, humidity, presence, gas };
        return newData;
      });
      // 将人体有无和温度存入状态管理库
      changeTemPresenceAction(sensorData.temperature,sensorData.presence)
    };

    ws.onclose = () => {
      console.log('WebSocket 关闭');
    };

    return () => {
      ws.close();
    };
  }, [])
  // 根据温度和人体存在状态控制蜂鸣器开关
  const checkGasValue = async (currentGasValue) => {
    console.log(`烟雾值: ${currentGasValue}`);
    if (currentGasValue >= gasThreshold) {
      try {
        const res = await axios.post(`${BASE_URL}/monitor/controlBuzzer`, { command: 'on' });
        console.log(res.data.message);
      } catch (error) {
        console.error('蜂鸣器开启错误:', error);
      }
    } else {
      try {
        const res = await axios.post(`${BASE_URL}/monitor/controlBuzzer`, { command: 'off' });
        console.log(res.data.message);
      } catch (error) {
        console.error('蜂鸣器开启错误:', error);
      }
    }
  };
  
  // 点击设置阈值按钮
  const handleThresholdClick = () => {
    setIsModalVisible(true)
  }
  // 处理模态框确定操作，更新烟雾阈值
  const handleOk = () => {
    setIsModalVisible(false)// 关闭模态框
    console.log(gasThreshold)
    setGasThreshold(gasThreshold)
    message.success('设置成功')
  }
  return (
    <div style={{ padding: '1.9531vw' }}>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="当前温度"
              value={data.temperature}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<FireOutlined />}
              suffix="°C"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="当前湿度"
              value={data.humidity}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CloudOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="烟雾"
              value={data.gas}
              precision={2}
              valueStyle={{ color: '#7f8600e8' }}
              prefix={<CloudOutlined />}
              suffix={<div>ppm
                <span onClick={handleThresholdClick}
                style={{fontSize:'12px',color:'#010101',marginLeft:'10px',cursor:'pointer'}}>设置阈值</span>
                </div>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="人体存在"
              value={data.presence ? "有人" : "无人"}
              valueStyle={{ color: data.presence ? '#000000' : 'rgb(0, 134, 116)' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        title="设置烟雾阈值"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <Input value={gasThreshold} onChange={e => setGasThreshold(e.target.value)} />
      </Modal>
    </div>
  );
})

export default MonitorSensor;
