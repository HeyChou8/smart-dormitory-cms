import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { Layout, theme } from 'antd';
import RepairSearch from './c-cpns/repair_search';
import RepairList from './c-cpns/repair_list';
import { useRef } from 'react';
const {Content, Footer } = Layout;
const MainRepair = memo((props) => {
  const repairListRef = useRef()
    const {
        token: { colorBgContainer, borderRadiusLG },
      } = theme.useToken();
      // 回调函数，接受子组件传过来的值，查询按钮
      const handleSearchClick = (values) => {
        repairListRef.current?.fetchRepairList(values,{offset:0,size:10}) 
      }
      // 重置按钮
      const handleResetClick = () => {
        repairListRef.current?.fetchRepairList()
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
           <RepairSearch onSearchClick={handleSearchClick} onResetClick={handleResetClick}></RepairSearch>
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
              <RepairList ref={repairListRef}></RepairList>
            </div>
          
        </Footer>
        </div>
  )
})

MainRepair.propTypes = {}

export default MainRepair