
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Switch, Card, Typography, Modal, InputNumber, Button, message } from 'antd'
import { AlertOutlined } from '@ant-design/icons'
import useMonitorStore from '../../../../store/index'
import {BASE_URL} from '../../../../config/index'
const AutoModeControl = () => {
  // 状态管理
  const [isAutoModeOn, setIsAutoModeOn] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [temperatureThreshold, setTemperatureThreshold] = useState(25)
  const temperature = useMonitorStore(state => state.temperature)
  const presence = useMonitorStore(state => state.presence)
// 获取初始自动模式设置
  useEffect(() => {
    const fetchInitialSettings = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/monitor/autoMode/settings`)
        setIsAutoModeOn(response.data.enabled)
        setTemperatureThreshold(response.data.temperatureThreshold)
      } catch (error) {
        console.error('获取设置失败', error)
        message.error('获取自动模式设置失败，请稍后再试')
        setIsAutoModeOn(false)
        setTemperatureThreshold(28)
      }
    };
    fetchInitialSettings()
  }, []);
  // 自动检查温度和人体存在状态，并控制风扇
  useEffect(() => {
    if (isAutoModeOn) {
      const intervalId = setInterval(() => {
        checkTemperatureAndPresence()
      }, 3000); // 每3秒检查一次

      return () => clearInterval(intervalId);
    }
  }, [isAutoModeOn, temperature, presence])
  // 根据温度和人体存在状态控制风扇开关
  const checkTemperatureAndPresence = async () => {
    if (temperature >= temperatureThreshold && presence) {
      try {
        await axios.post(`${BASE_URL}/monitor/controlFan`, { command: 'on' })
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await axios.post(`${BASE_URL}/monitor/controlFan`, { command: 'off' })
      } catch (error) {
        console.error(error);
      }
    }
  };
  // 关闭自动模式时，检查并关闭风扇的函数
  const checkAndTurnOffFan = async () => {
    if (temperature >= temperatureThreshold && presence) {
      try {
        await axios.post(`${BASE_URL}/monitor/controlFan`, { command: 'off' })
      } catch (error) {
        console.error(error);
      }
    }
  };
// 切换自动模式的主要逻辑
  const toggleAutoMode = async() => {
     // 如果自动模式已开启，则直接关闭而不显示模态框
  if (isAutoModeOn) {
    setIsAutoModeOn(false)
    // 关闭自动模式时额外检查风扇状态并可能关闭风扇
    await checkAndTurnOffFan()
    updateAutoModeSettings(false, temperatureThreshold)
  } else {
    // 如果自动模式处于关闭状态，则显示模态框以便用户设置温度阈值
    setIsModalVisible(true);
  }
  };
  // 更新自动模式设置
  const updateAutoModeSettings = async (enabled, threshold) => {
    try {
      const res = await axios.post(`${BASE_URL}/monitor/autoMode/settings`, {
        enabled,
        temperatureThreshold: threshold
      },{
        headers: {
          'Content-Type': 'application/json',
        }});
      message.success('自动模式设置更新成功');
      setIsAutoModeOn(enabled) // 更新自动模式开关状态
    } catch (error) {
      console.error(error)
      message.error('自动模式设置更新失败');
      setIsAutoModeOn(false)
    }
  };
  // 处理模态框确定操作，更新温度阈值和自动模式设置
  const handleOk = async () => {
    setIsModalVisible(false)// 关闭模态框
    setTemperatureThreshold(temperatureThreshold) 
    updateAutoModeSettings(true, temperatureThreshold) // 更新设置
  };

  return (
    <Card bordered={true} style={{ width: '19.5313vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography.Title level={4} style={{ color: 'rgba(1, 1, 1, 0.79)'}}>自动调控</Typography.Title>
      <AlertOutlined style={{ fontSize: '1.5625vw', color: isAutoModeOn ? '#52c41a' : '#8c8c8c', marginBottom: '0.651vw', marginLeft: '0.1953vw' }}/>
      <Switch 
        checkedChildren="开" 
        unCheckedChildren="关" 
        checked={isAutoModeOn} 
        onClick={toggleAutoMode} 
        style={{ marginBottom: '0.5208vw', marginLeft: '0.3255vw' }}
      />
      <Modal
      style={{top:200}}
        title="设置温度阈值"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <p>请输入开启风扇的温度阈值:</p>
        <InputNumber min={1} max={50} value={temperatureThreshold} onChange={value => setTemperatureThreshold(value)} />
      </Modal>
    </Card>
  );
};

export default AutoModeControl
