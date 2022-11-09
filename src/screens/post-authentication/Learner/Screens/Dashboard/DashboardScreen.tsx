import { HEADER_ITEMS, MENU_ITEMS, MenuItems } from './constants'
import { Layout, Menu } from 'antd'
import { Outlet, useNavigate } from 'react-router'
import React, { useState } from 'react'

import LogoImage from './logo.svg'
import styled from '@emotion/styled'

const LogoHolder = styled.div`
  padding: 20px;
`

const Logo = styled.img`
  width: 115px;
  margin: auto;
  display: block;
`

const { Header, Content, Sider } = Layout

const LearnerDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={MenuItems(HEADER_ITEMS)}
          />
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Outlet />
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  )
}

export default LearnerDashboard
