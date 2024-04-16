
import React, { memo } from 'react'
import { Layout, theme } from 'antd';
import NoticeSearch from './c-cpns/notice_search';
import NoticeList from './c-cpns/notice_list';
import { useRef } from 'react';
const {Content, Footer } = Layout;
const MainNotice = memo(() => {
  const noticeListRef = useRef()
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
      // 回调函数，接受子组件传过来的值，查询按钮
      const handleSearchClick = (values) => {
        noticeListRef.current?.fetchNoticeList(values,{offset:0,size:10}) 
      }
      // 重置按钮
      const handleResetClick = () => {
        noticeListRef.current?.fetchNoticeList()
      }
  return (
        <div className="main_notice">
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
           <NoticeSearch onSearchClick={handleSearchClick} onResetClick={handleResetClick}></NoticeSearch>
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
              <NoticeList ref={noticeListRef}></NoticeList>
            </div>
          
        </Footer>
        </div>
  )
})

export default MainNotice