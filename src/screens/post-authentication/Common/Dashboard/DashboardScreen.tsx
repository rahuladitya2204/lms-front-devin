import { Layout, Menu } from 'antd'
import { MENU_ITEMS, MenuItems } from './constants'
import { Outlet, useNavigate } from 'react-router'
import React, { useState } from 'react'

import type { MenuProps } from 'antd'

const { Header, Content, Sider } = Layout

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
      >
        <div className="logo" />
        <Menu
          onClick={e => navigate(e.keyPath.join(''))}
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={MenuItems(MENU_ITEMS)}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Outlet />
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  )
}

export default App
