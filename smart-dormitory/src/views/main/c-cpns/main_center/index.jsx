import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { Layout, theme } from 'antd';
import CenterInfo from './c-cpns/center_info';
import { MainCenterWrapper } from '../main_center/style';
import CenterAvatar from './c-cpns/center_avatar';
const {Content} = Layout;
const MainCenter = memo((props) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
  return (
    <MainCenterWrapper>
      <div className="mainInfo">
        <Content
          style={{
            margin: '0 1.0417vw',
          }}
        > 
          <div className='info'
            style={{
              padding: '1.5625vw',
              minHeight: '41.6667vw',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <CenterAvatar></CenterAvatar>
            <CenterInfo></CenterInfo>
          </div>
        </Content>
        
        </div>
    </MainCenterWrapper>
    
  )
})

MainCenter.propTypes = {}

export default MainCenter