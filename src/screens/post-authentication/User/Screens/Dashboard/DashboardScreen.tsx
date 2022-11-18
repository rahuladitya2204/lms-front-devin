import { MENU_ITEMS, MenuItems } from './constants'
import { Col, Layout, Menu, Row } from 'antd'
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

const { Content, Sider } = Layout

const UserDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        theme="light"
        collapsed={collapsed}
        onCollapse={value => setCollapsed(value)}
      >
        <LogoHolder>
          <Logo src={LogoImage} />
        </LogoHolder>
        <Menu
          onClick={e => navigate(e.key)}
          theme="light"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={MenuItems(MENU_ITEMS)}
        />
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '0 16px' }}>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Outlet />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  )
}

export default UserDashboard
