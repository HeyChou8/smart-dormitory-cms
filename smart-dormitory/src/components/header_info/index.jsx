import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { Dropdown, Space } from 'antd';
import { DownOutlined, SmileOutlined,CloseCircleOutlined,InfoCircleOutlined,UnlockOutlined } from '@ant-design/icons';
import { localCache } from '../../utils/cache.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import MainChangePwd from '../change_password_modal';

const HeaderInfo = memo((props) => {
  const navigate = useNavigate()
  const route = useLocation()
  const account = localCache.getCache('account')
  // 退出登录点击事件
  const handleSignOutClick = () => {
    // 先移除token再跳转到login页面
    localCache.removeCache('login_token')
    localCache.removeCache('account')
    localCache.removeCache('copyRole')
    localCache.removeCache('user_id')
    navigate('/login')
  }
  const handleProfileClick = () => {
    if(route.pathname !== '/main/center'){
      navigate('/main/center')
    }
  }
  const handleChangePwdClick = () =>{

  }
  const items =[
    {
      key:'1',
      label:(<span onClick={handleSignOutClick}>退出系统</span>),
      icon: <CloseCircleOutlined />
    },
    {
      key:'2',
      label:(<span onClick={handleProfileClick}>个人信息</span>),
      icon: <InfoCircleOutlined />
    },
    {
      key:'3',
      label:(<MainChangePwd></MainChangePwd>),
      icon: <UnlockOutlined />
    },
  ]
  return (
    <div className='header_info' style={{marginRight:'1.9531vw'}}>
  

      <Dropdown
    menu={{
      items,
    }}
    trigger='hover'
  >
   <Space>
   <span style={{fontSize:'1.1719vw'}}>{account}</span>
    <DownOutlined/>
   </Space>
  </Dropdown>
    </div>
  )
})

HeaderInfo.propTypes = {}

export default HeaderInfo