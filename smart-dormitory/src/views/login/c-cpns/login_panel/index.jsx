import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { LoginPanelWrapper } from './style'
import { Tabs } from 'antd';
import { UserOutlined, TeamOutlined} from '@ant-design/icons';
import Panel from './panel';

const LoginPanel = memo((props) => {
  const onChange = (key) => {
    // console.log(key);
  };
  const items = [
    {
      key: '1',
      label: '学生',
      children: <Panel/>,
      icon: <UserOutlined/>
    },
    {
      key: '2',
      label: '管理员',
      children: <Panel/>,
      icon: <TeamOutlined/>
    },
  ]
  return (
    <LoginPanelWrapper>
        <div className='login_panel'>
            <h1 className='title'>智慧宿舍管理系统</h1>
            <div className="panel">
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} centered />
            </div>
        </div>
    </LoginPanelWrapper>
  )
})

LoginPanel.propTypes = {}

export default LoginPanel