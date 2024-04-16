import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { FireOutlined, CloudOutlined, UserOutlined } from '@ant-design/icons';
import UseMainStore from '../../../../../../store/main';
import { WS_BASE_URL } from '@/service/request/config';
const MonitorSensor = () => {
  const [data, setData] = useState({ temperature: 0, humidity: 0, presence: false });
  const {changeTemPresenceAction} = UseMainStore()
  useEffect(() => {
    // 监听8002端口
    const ws = new WebSocket(WS_BASE_URL);

    ws.onopen = () => {
      console.log('WebSocket 开启');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { temperature, humidity, presence } = message;
      const sensorData = { temperature, humidity, presence };
      setData(sensorData);
      changeTemPresenceAction(sensorData.temperature,sensorData.presence)
    };

    ws.onclose = () => {
      console.log('WebSocket 关闭');
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div style={{ padding: '1.9531vw' }}>
      <Row gutter={16}>
        <Col span={8}>
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
        <Col span={8}>
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
        <Col span={8}>
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
    </div>
  );
}

export default MonitorSensor;
