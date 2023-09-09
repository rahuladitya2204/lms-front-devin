import { Col, Layout, Menu, Row } from 'antd'
import { MENU_ITEMS, MenuItems } from './constants'
import { Outlet, useNavigate } from 'react-router'
import React, { useEffect, useState } from 'react'

import AppProvider from 'screens/AppProvider'
import LogoImage from './logo.svg'
import { Store } from '@adewaskar/lms-common'
import ThemeProvider from 'screens/ThemeProvider'
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

const UserRootScreen: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  // const { isSignedIn } = Store.useAuthentication(s => s)

  // useEffect(
  //   () => {
  //     // console.log()
  //     if (!isSignedIn) {
  //       navigate('../app/store')
  //     }
  //     else {
  //       navigate('../login')
  //     }
  //   },
  //   [isSignedIn]
  // )
  const navigate = useNavigate()
  return (
    <ThemeProvider type="user">
      <AppProvider>
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
      </AppProvider>
    </ThemeProvider>
  )
}

export default UserRootScreen
