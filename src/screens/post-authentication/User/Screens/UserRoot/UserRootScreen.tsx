import { Col, Menu, Row } from 'antd'
import Layout, { Content, Sider } from '@Components/Layout'
import { MENU_ITEMS, MenuItems } from './constants'
import { Outlet, useNavigate } from 'react-router'
import React, { useEffect, useState } from 'react'

import AppProvider from 'screens/AppProvider'
import { ModalProvider } from '@Components/ActionModal/ModalContext'
import OrgLogo from '@Components/OrgLogo'
import ThemeProvider from 'screens/ThemeProvider'
import { User } from '@adewaskar/lms-common'
import styled from '@emotion/styled'

const LogoHolder = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
`

// const { Content, Sider } = Layout

const UserRootScreen: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  return (
    <ThemeProvider>
      <ModalProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          theme="light"
          collapsed={collapsed}
          onCollapse={value => setCollapsed(value)}
        >
          <LogoHolder>
            <OrgLogo />
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
      </ModalProvider>
    </ThemeProvider>
  )
}

export default UserRootScreen
