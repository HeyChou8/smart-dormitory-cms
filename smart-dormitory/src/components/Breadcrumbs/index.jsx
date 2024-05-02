import React, { memo } from 'react'
import { useLocation } from 'react-router-dom'
import { Breadcrumb } from 'antd'
import { MenuFoldOutlined } from '@ant-design/icons'
const Breadcrumbs = memo(({menuData}) => {
    const location = useLocation()
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const menuItem = menuData.find(item => item.path === url);
      return menuItem ? (
            <Breadcrumb.Item key={url}><h2><MenuFoldOutlined style={{fontSize: '1.5625vw',marginRight:'0.651vw'}} />{menuItem.label}</h2></Breadcrumb.Item>
      ) : null;
    });
  
    return (
        <Breadcrumb
        style={{
          fontSize: '1.0417vw',
          margin: '1.0417vw 0.9766vw',
        }}
      >
        {extraBreadcrumbItems}
      </Breadcrumb>
    )
})

export default Breadcrumbs