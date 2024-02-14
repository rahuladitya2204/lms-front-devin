import { Col, Menu, Row } from 'antd'
import { Constants, Enum, Store, User } from '@adewaskar/lms-common'
import Layout, { Content, Sider } from '@Components/Layout'
import { MENU_ITEMS, MenuItems } from './constants'
import { Outlet, useNavigate } from 'react-router'
import React, { useEffect, useState } from 'react'

import AppProvider from 'screens/AppProvider'
import { ModalProvider } from '@Components/ActionModal/ModalContext'
import OrgLogo from '@Components/OrgLogo'
import ThemeProvider from 'screens/ThemeProvider'
import { UserOutlined } from '@ant-design/icons'
import { compareArrays } from '@Components/SunEditor/utils'
import styled from '@emotion/styled'
import useBreakpoint from '@Hooks/useBreakpoint'

const LogoHolder = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
`

// const { Content, Sider } = Layout

const UserRootScreen: React.FC = () => {
  const { isDesktop } = useBreakpoint()
  return (
    <ThemeProvider>
      <ModalProvider>
        <Layout style={{ minHeight: '100vh' }}>
          {isDesktop ? <AppSider /> : null}
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

export const AppSider = () => {
  const [collapsed, setCollapsed] = useState(false)
  const isAdmin = Store.useGlobal(s => s.isAdmin)
  const navigate = useNavigate()
  const menuItems = [...MENU_ITEMS]
  if (isAdmin) {
    menuItems.unshift({
      title: 'Admin',
      icon: <UserOutlined />,
      path: 'admin',
      children: [
        {
          title: 'News',
          // icon: <PaperClipOutlined />,
          path: 'news',
          roles: [Enum.UserRole.NEWS_MANAGER]
        },
        {
          title: 'Topics',
          // icon: <PaperClipOutlined />,
          path: 'topics'
        },
        {
          title: 'Organisations',
          // icon: <PaperClipOutlined />,
          path: 'organisation',
          roles: [Enum.UserRole.ORG_MANAGER]
        }
      ]
    })
  }
  const { data: { roles } } = User.Queries.useGetUserDetails()
  const permissions = roles
    .map(r => Constants.USER_ROLES.find(rr => rr.slug === r))
    .flat()
  const filteredMenuItems = menuItems
    .map(mItem => {
      // @ts-ignore
      mItem.children = mItem?.children?.filter(
        // @ts-ignore
        u => {
          const P = (u?.roles || [])
            .map(r => Constants.USER_ROLES.find(rr => rr.slug === r))
            .flat()
          return (
            compareArrays(P || [], permissions) ||
            roles.find(r => Enum.UserRole.ADMIN)
          )
        }
      )
      return mItem
    })
    .filter(
      u =>
        compareArrays(u.roles || [], roles) ||
        roles.find(r => Enum.UserRole.ADMIN)
    )
  const { isDesktop } = useBreakpoint()
  return (
    <Sider
      collapsible={isDesktop}
      theme="light"
      collapsed={collapsed}
      onCollapse={value => setCollapsed(value)}
    >
      <LogoHolder>
        <OrgLogo width="150px" quality="high" />
      </LogoHolder>
      <Menu
        onClick={e => navigate(e.key)}
        theme="light"
        defaultSelectedKeys={['1']}
        mode="inline"
        items={MenuItems(filteredMenuItems)}
      />
    </Sider>
  )
}

export default UserRootScreen
