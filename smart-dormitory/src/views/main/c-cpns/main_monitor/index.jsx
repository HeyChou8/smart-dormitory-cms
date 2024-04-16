
import React, { memo } from 'react'
import { Layout, theme } from 'antd';
import { MainMonitorWrapper } from './style';
import MonitorSensor from './c-cpns/monitor_sensor';
import LightControl from './c-cpns/light_controll';
import FanControl from './c-cpns/fan_control';
import PowerScheduleControl from './c-cpns/power_schedule_control';
import AutoModeControl from './c-cpns/auto_mode_control';
const {Content, Footer } = Layout;
const MainMonitor = memo(() => {
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
  return (
    <MainMonitorWrapper>
        <div className="mainMonitor">
        <Content
          style={{
            margin: '0 1.0417vw',
          }}
        >
          <div
            style={{
              padding: '1.5625vw',
              minHeight: '7.8125vw',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <MonitorSensor/>
          </div>
        </Content>
        <Footer
          style={{
            padding: '1.1068vw'
          }}
        >
          <div style={{
              padding: '1.5625vw',
              minHeight: '52.0833vw',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
              <div className="main_control">
              <div className="row">
              <LightControl/>
              <FanControl/>
              </div>
              <div className="row">
              <PowerScheduleControl/>
              <AutoModeControl/>
              </div>
              </div>
            </div>
          
        </Footer>
        </div>
    </MainMonitorWrapper>
  )
})


export default MainMonitor