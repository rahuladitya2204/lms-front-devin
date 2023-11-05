import {
  AutoComplete,
  Avatar,
  Badge,
  Button,
  Col,
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
  LogoutOutlined,
  MenuFoldOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Learner, Store, Types } from '@adewaskar/lms-common'
import { Link, NavLink } from 'react-router-dom'
import { Outlet, useNavigate } from 'react-router'

import ActionModal from '@Components/ActionModal'
import Header from '@Components/Header'
import Image from '@Components/Image'
import LoginScreen from '@Learner/Screens/Login'
import OrgLogo from '@Components/OrgLogo'
import SearchLearnerCourses from '@Components/SearchLearnerCourses'
import useBreakpoint from '@Hooks/useBreakpoint'

const { confirm } = Modal

const { Content } = Layout
const { Text, Title } = Typography

const menuItems = [
  { title: 'Store', link: 'store', icon: <ShopOutlined /> },
  { title: 'Courses', link: 'courses', icon: <DesktopOutlined /> },
  { title: 'Tests', link: 'test', icon: <EditOutlined /> },
  { title: 'Events', link: 'event', icon: <CalendarOutlined /> }
]

const LearnerHeader: React.FC = () => {
  const {
    mutate: logoutLearner,
    isLoading: loggingOut
  } = Learner.Queries.useLogoutLearner()

  const { isSignedIn } = Store.useAuthentication(state => state)

  const { data: { items } } = Learner.Queries.useGetCartDetails({
    enabled: !!isSignedIn
  })
  const screen = useBreakpoint()
  // console.log(screen, 'scrrrr')
  const isMobileOrTablet = screen.isMobile || screen.isTablet
  const navigate = useNavigate()
  const logout = () => {
    confirm({
      title: 'Are you sure?',
      icon: <LogoutOutlined />,
      content: `You want to logout?`,
      onOk() {
        logoutLearner(undefined, {
          onSuccess: () => {
            navigate('../app/store')
          }
        })
      },
      okText: 'Yes, Logout'
    })
  }

  return (
    <Header
      hideBack
      title={
        <Space style={{ cursor: 'pointer', paddingLeft: 10 }}>
          <OrgLogo
            onClick={() => navigate('../app/store')}
            style={{ width: 60 }}
          />
          {!isMobileOrTablet ? (
            <Space style={{ display: 'flex', marginLeft: 25 }} align="center">
              <SearchLearnerCourses />
            </Space>
          ) : null}
          {/* <Search
              placeholder="Search Courses"
              // onSearch={onSearch}
              style={{ width: 200 }}
            /> */}
        </Space>
      }
      bgColor="#fff"
      extra={[
        // <Link to={`store`} style={{ margin: '0 10px' }}>
        //   <Text strong>Blogs</Text>
        // </Link>,
        ...(isMobileOrTablet
          ? [
              <Dropdown
                trigger={['click']}
                placement="bottomLeft"
                overlay={
                  <Menu>
                    {menuItems.map(item => {
                      return (
                        <Menu.Item
                          onClick={() => {
                            navigate(item.link)
                          }}
                        >
                          {item.title}
                        </Menu.Item>
                      )
                    })}
                  </Menu>
                }
              >
                <Button shape="circle" icon={<MenuFoldOutlined />} />
              </Dropdown>
            ]
          : isSignedIn
            ? [
                <div style={{ marginRight: 50 }}>
                  {menuItems.map(item => {
                    return (
                      <NavLink
                        to={item.link}
                        style={{ margin: '0 5px' }}
                        children={({ isActive }) => {
                          return (
                            <Button
                              style={{ borderRadius: 15 }}
                              size="middle"
                              icon={item.icon}
                              type={isActive ? 'primary' : 'default'}
                            >
                              {item.title}
                            </Button>
                          )
                        }}
                      />
                    )
                  })}
                </div>
              ]
            : // <div style={{ marginRight: 100 }}>
              //         {menuItems.map(item => {
              //           return (
              //             <NavLink
              //               to={item.link}
              //               style={{ margin: '0 10px' }}
              //               children={({ isActive }) => {
              //                 return (
              //                   <Button type={isActive ? 'primary' : 'default'}>
              //                     {item.title}
              //                   </Button>
              //                 )
              //               }}
              //             />
              //           )
              //         })}
              //       </div>
              [
                <ActionModal
                  width={300}
                  title="Login"
                  cta={<Button style={{ margin: '0 10px' }}>Login</Button>}
                >
                  <LoginScreen />
                </ActionModal>
              ]),

        isSignedIn ? (
          <Space>
            <Badge count={items.length} showZero={false}>
              <Button
                onClick={() => {
                  navigate('cart')
                }}
                type="primary"
                shape="circle"
                icon={<ShoppingCartOutlined />}
              />
            </Badge>
            <Dropdown
              trigger={['click']}
              placement="bottomLeft"
              overlay={
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      navigate('account')
                    }}
                  >
                    My Account
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      navigate('tickets')
                    }}
                  >
                    Help and Support
                  </Menu.Item>
                  <Menu.Item onClick={logout}>Logout</Menu.Item>
                </Menu>
              }
            >
              <Button shape="circle" icon={<UserOutlined />} />
            </Dropdown>
          </Space>
        ) : null
      ]}
      className="site-layout-background"
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
