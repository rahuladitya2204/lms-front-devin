import {
  AutoComplete,
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Dropdown,
  Grid,
  Layout,
  Menu,
  Modal,
  Row,
  Space,
  Spin,
  Typography
} from 'antd'
import {
  CalendarOutlined,
  DesktopOutlined,
  EditOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Learner, Store, Types, Utils } from '@adewaskar/lms-common'
import { Link, NavLink } from 'react-router-dom'
import { Outlet, useNavigate } from 'react-router'

import ActionDrawer from '@Components/ActionDrawer'
import ActionModal from '@Components/ActionModal'
import Header from '@Components/Header'
import Image from '@Components/Image'
import LoginScreen from '@Learner/Screens/Login'
import OrgLogo from '@Components/OrgLogo'
import SearchLearnerCourses from '@Components/SearchLearnerCourses'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useQueryClient } from '@tanstack/react-query'

const { confirm } = Modal

const { Content } = Layout
const { Text, Title } = Typography

const LearnerHeader: React.FC = () => {
  const {
    mutate: logoutLearner,
    isLoading: loggingOut
  } = Learner.Queries.useLogoutLearner()
  const qc = useQueryClient()
  const { isSignedIn, user } = Store.useAuthentication(state => state)

  const { data: { items } } = Learner.Queries.useGetCartDetails({
    enabled: !!isSignedIn
  })
  const screen = useBreakpoint()
  // console.log(screen, 'scrrrr')
  const isMobileOrTablet = screen.isMobile || screen.isTablet
  const navigate = useNavigate()
  const logout = (cb?: Function) => {
    confirm({
      title: 'Are you sure?',
      icon: <LogoutOutlined />,
      content: `You want to logout?`,
      onOk() {
        logoutLearner(undefined, {
          onSuccess: () => {
            qc.invalidateQueries()
            navigate('../app/store')
            cb && cb()
          }
        })
      },
      okText: 'Yes, Logout'
    })
  }
  const menuItems = [
    { label: 'Store', key: 'store', icon: <ShopOutlined /> },
    { label: 'My Courses', key: 'courses', icon: <DesktopOutlined /> },
    { label: 'My Tests', key: 'test', icon: <EditOutlined /> },
    { label: 'My Events', key: 'event', icon: <CalendarOutlined /> }
  ]
  if (isMobileOrTablet) {
    menuItems.unshift({
      label: 'My Account',
      key: 'account',
      icon: <UserOutlined />
    })
  }
  // Define the extraContent
  const extraContent = (
    <Space>
      {isMobileOrTablet ? (
        <ActionDrawer
          footer={closeDrawer => [
            <Button
              loading={loggingOut}
              onClick={() => {
                logout(closeDrawer)
              }}
              type="primary"
              block
            >
              Logout
            </Button>
          ]}
          cta={<Button icon={<MenuOutlined />} />}
        >
          <Menu
            defaultSelectedKeys={['1']}
            // defaultOpenKeys={['sub1']}
            mode="inline"
            onClick={e => {
              navigate(e.key)
            }}
            // theme="dark"
            // inlineCollapsed={collapsed}
            items={menuItems}
          />
        </ActionDrawer>
      ) : isSignedIn ? null : (
        <ActionModal
          width={300}
          title="Login"
          cta={
            <Button
              icon={<LoginOutlined />}
              type="primary"
              style={{ margin: '0 10px' }}
            >
              Login
            </Button>
          }
        >
          <LoginScreen />
        </ActionModal>
      )}

      {isSignedIn &&
        !isMobileOrTablet && (
          <Space>
            {!screen.isMobile ? (
              <Badge count={items?.length || 0} showZero={false}>
                <Button
                  onClick={() => navigate('../app/cart')}
                  type="primary"
                  shape="circle"
                  icon={<ShoppingCartOutlined />}
                />
              </Badge>
            ) : null}

            <Dropdown
              trigger={['click']}
              placement="bottomLeft"
              overlay={
                <Menu>
                  <Menu.Item
                    key="account"
                    icon={
                      <Avatar src={user.image} style={{ marginRight: 10 }}>
                        {Utils.getFirstLettersOfName(user.name)}
                      </Avatar>
                    }
                    onClick={() => navigate('../app/account')}
                  >
                    {user?.name}
                  </Menu.Item>
                  {/* <Menu.Item
                  key="account"
                >
                  My Account
                </Menu.Item> */}
                  <Menu.Item
                    key="support"
                    icon={<UserOutlined />}
                    onClick={() => navigate('../app/tickets')}
                  >
                    Help and Support
                  </Menu.Item>
                  <Menu.Item
                    icon={<LogoutOutlined />}
                    key="logout"
                    onClick={()=>logout()}
                  >
                    Logout
                  </Menu.Item>
                </Menu>
              }
            >
              <Button shape="circle" icon={<UserOutlined />} />
            </Dropdown>
          </Space>
        )}
    </Space>
  )

  return (
    <Header
      hideBack
      title={
        <Space style={{ cursor: 'pointer', paddingLeft: 10 }}>
          <OrgLogo
            onClick={() => navigate('../app/store')}
            // style={{ width: 60 }}
          />
          {screen.isDesktop && isSignedIn ? (
            <Space style={{ marginLeft: 45 }}>
              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={`../app/${item.key}`}
                  style={{ margin: '0 5px' }}
                  children={({ isActive }) => (
                    <Button
                      style={{ borderRadius: 15 }}
                      size="middle"
                      icon={item.icon}
                      type={isActive ? 'primary' : 'default'}
                    >
                      {item.label}
                    </Button>
                  )}
                />
              ))}{' '}
              {/* <Divider orientation="right" /> */}
            </Space>
          ) : null}
          {/* {!isMobileOrTablet ? (
            <Space style={{ display: 'flex', marginLeft: 25 }} align="center">
              <SearchLearnerCourses />
            </Space>
          ) : null} */}
          {/* <Search
              placeholder="Search Courses"
              // onSearch={onSearch}
              style={{ width: 200 }}
            /> */}
        </Space>
      }
      // bgColor="#fff"
      extra={extraContent}
      // className="site-layout-background"
      style={{ padding: 0 }}
    >
      <Content style={{ margin: '0 16px' }}>
        <Spin tip="Please wait.. Logging you out." spinning={loggingOut}>
          <Row style={{ paddingTop: 20 }}>
            <Col span={2} />
            <Col span={20}>
              <Outlet />
            </Col>
            <Col span={2} />
          </Row>
        </Spin>
      </Content>
    </Header>
  )
}

export default LearnerHeader
