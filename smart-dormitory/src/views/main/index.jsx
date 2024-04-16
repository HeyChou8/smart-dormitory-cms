import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  UserOutlined,
  HomeTwoTone,
  ToolOutlined,
  ProfileOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme,Modal } from 'antd';
import { MainWrapper } from './style';  
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { localCache } from '../../utils/cache.ts';
import { useEffect } from 'react';
import HeaderInfo from '../../components/header_info/index';
import UseLoginStore from '../../store/login'
const { Header,  Sider } = Layout;

// function getItem(label, key, icon, children) {
//   return {
//     key,
//     icon,
//     children,
//     label,
//   };
// }

// const items = [
//   getItem('用户管理', '1', <UserOutlined />),
//   getItem('学生信息管理', '2',<ProfileOutlined />, ),
//   getItem('监测控制', '3', <DesktopOutlined /> ),
//   getItem('报修管理', '4', <ToolOutlined />),
//   getItem('宿舍公告和通知', '5', <FileOutlined />),
// ];

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey,setSelectedKey] = useState('1')
  const route = useLocation()
  const menuList = localCache.getCache('menuList')
  const navigate = useNavigate()
  const isTokenValidAction = UseLoginStore(state => state.isTokenValidAction)
  const [tokenExpired, setTokenExpired] = useState(false);
  const token = localCache.getCache('login_token');
  useEffect(() => {
    if(menuList?.length === 4){
      setSelectedKey('2')
      navigate('/main/monitor')
    }else {
      navigate('/main/user')
    }
    // 检查token有效性
    const checkTokenValidity = () => {
      if (!isTokenValidAction()) {
        setTokenExpired(true);
      }
  };
    // 初次渲染时检查 token 有效性
    checkTokenValidity();
    const tokenCheckInterval = setInterval(() => {
      checkTokenValidity();
  }, 60000); // 每分钟检查一次 token 有效性

  return () => {
      clearInterval(tokenCheckInterval);
  };
  },[])
  // 弹框出现
  useEffect(() => {
    if(tokenExpired){
      const tokenExpiredAlert = () => {
        Modal.error({
            // title: 'Token 过期',
            content: '您的登录信息已过期，请重新登录。',
            onOk: () => {
                // 用户点击确定按钮后的操作，例如执行退出系统的操作
                localCache.removeCache('login_token')
                localCache.removeCache('account')
                localCache.removeCache('copyRole')
                localCache.removeCache('user_id')
                navigate('/login')
            },
        });
      };
      
      // 调用函数显示 Modal 提示框
      tokenExpiredAlert();
    }
  },[tokenExpired])
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const iconArr = [<UserOutlined />,<DesktopOutlined />,<ProfileOutlined />,<ToolOutlined />,<FileOutlined />]
  // 处理数据并把图标存入数组
  const menuListHandled = menuList?.map((item) =>{
    const key = item.menu_id
    const label = item.menu_name
    return {label,key}
  })
  // 遍历图标数组存入菜单列表中
    iconArr.forEach((item,index) => {
      if(index<menuListHandled?.length){
        menuListHandled[index].icon = item
      }
  }) 
  // 菜单点击事件
const handleMenuClick = (e) => {
  setSelectedKey(e.key)
  switch(e.key){
    case '1': navigate('user')
    break
    case '2': navigate('monitor')
    break
    case '3': navigate('center')
    break
    case '4': navigate('repair')
    break
    case '5': navigate('notice')
    break
  }
}
function getMenuName(key){
  switch (key) {
    case '1':
      return '用户管理';
    case '2':
      return '监测控制';
    case '3':
      return '个人中心';
    case'4':
      return '报修管理';
    case '5':
      return '宿舍公告和通知';
    default: 
      return '';
  }
}
  return (
    <MainWrapper>
      <div className="main">
      <Layout
      style={{
        minHeight: '100vh',
        
      }}
    >
      <Sider style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      collapsible collapsed={collapsed} 
      onCollapse={(value)=>{setCollapsed(value)}}>
        <div className='logo' style={{marginLeft:  !collapsed ? '0.651vw' : '1.3021vw'}}>
        <HomeTwoTone  style={{fontSize: '1.5625vw',marginRight: '0.9766vw'}}/>
          {!collapsed && <h2 className='title'>智慧宿舍管理系统</h2>}
        </div>
        <Menu theme="dark" defaultSelectedKeys={menuList?.length===5 ?['1'] : ['2']} 
        mode="inline" items={menuListHandled} onClick={handleMenuClick} />
      </Sider>
      <div className="main_content" style={{marginLeft: !collapsed ? '13.0208vw' : '4.8828vw',
       width: !collapsed ? '86vw' : '94vw'}} >  
      <Layout>
        <Header style={{
            padding: 0,
            background: colorBgContainer,
            height:'4.1667vw',
            marginBottom: '1.0417vw',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
             <Breadcrumb
            style={{
              fontSize: '1.0417vw',
              margin: '1.0417vw 0.9766vw',
            }}
          >
            <Breadcrumb.Item><h2><MenuFoldOutlined style={{fontSize: '1.5625vw',marginRight:'0.651vw'}} />{getMenuName(selectedKey)}</h2></Breadcrumb.Item>
          </Breadcrumb>
          <HeaderInfo/>
          </Header>
          <Outlet></Outlet>
      </Layout>
      </div>
    </Layout>
      </div>
    </MainWrapper>
  );
};

export default Main;