
import React, { memo } from 'react'
import { Layout, theme } from 'antd';
import UserSearch from './c-cpns/user_search';
import UserList from './c-cpns/user_list';
import { useRef } from 'react';
const {Content, Footer } = Layout;
const MainUser = memo(() => {
  const userListRef = useRef()
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
      // 回调函数，接受子组件传过来的值，查询按钮
      const handleSearchClick = (values) => {
        userListRef.current?.fetchUserList(values,{offset:0,size:10}) 
        // userListRef.current?.setPagination({...userListRef.current?.pagination,current:1})
      }
      // 重置按钮
      const handleResetClick = () => {
        userListRef.current?.fetchUserList()
      }
  return (
    
        <div className="main_user">
        <Content
          style={{
            margin: '0 1.0417vw',
          }}
        >
          <div
            style={{
              padding: '1.3021vw 7.1615vw',
              minHeight: '7.8125vw',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
           <UserSearch onSearchClick={handleSearchClick} onResetClick={handleResetClick}></UserSearch>
          </div>
          
        </Content>
        <Footer
          style={{
            padding: '1.1068vw'
          }}
        >
          <div style={{
              padding: '1.5625vw',
              minHeight: '45.5729vw',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}>
              <UserList ref={userListRef}></UserList>
            </div>
          
        </Footer>
        </div>
    
  )
})


export default MainUser