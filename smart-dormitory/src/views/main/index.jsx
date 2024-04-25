import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  UserOutlined,
  HomeTwoTone,
  ToolOutlined,
  ProfileOutlined,
  AreaChartOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme,Modal } from 'antd';
import { MainWrapper } from './style';  
import { Outlet, useLocation, useNavigate,Link } from 'react-router-dom';
import { localCache } from '../../utils/cache.ts';
import { useEffect } from 'react';
import HeaderInfo from '../../components/header_info/index';
import UseLoginStore from '../../store/login'
import Breadcrumbs from '@/components/Breadcrumbs';
const { Header,  Sider } = Layout;

const Main = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys,setSelectedKeys] = useState([])
  const menuList = localCache.getCache('menuList')
  const navigate = useNavigate()
  const isTokenValidAction = UseLoginStore(state => state.isTokenValidAction)
  const [tokenExpired, setTokenExpired] = useState(false);
  const route = useLocation()
  useEffect(() => {
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
  // 根据路径匹配菜单
  useEffect(() => {
    const path = route.pathname
    const match = menuListHandled.find(item => item.path === path);
    if (match) {
      setSelectedKeys([match.key]);
    }
  }, [route.pathname]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const iconArr = [<UserOutlined />,<DesktopOutlined />,<ProfileOutlined />,<ToolOutlined />,<FileOutlined />,<AreaChartOutlined />]
  // 处理数据并把图标存入数组
  const menuListHandled = menuList?.map((item) =>{
    const key = String(item.menu_id)
    const label = item.menu_name
    const path = item.menu_url
    return {label,key,path}
  })
  // 遍历图标数组存入菜单列表中
    iconArr.forEach((item,index) => {
      if(index<menuListHandled?.length){
        menuListHandled[index].icon = item
      }
  }) 
  // 移除最后一个对象
  const lastObj = menuListHandled.pop()
  // 将最后一个对象添加到数组第一个
  menuListHandled.unshift(lastObj)
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
        <Menu theme="dark" selectedKeys={selectedKeys} 
        mode="inline" items={menuListHandled.map(item => ({
          key: item.key,
          icon: item.icon,
          label: <Link to={item.path}>{item.label}</Link>
        }))} />
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
          <Breadcrumbs menuData={menuListHandled}/>
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