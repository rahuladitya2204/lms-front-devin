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
  Typography,
  message
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
import LoginScreen from '@Learner/Screens/Login'
import OrgLogo from '@Components/OrgLogo'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useMemo } from 'react'
import useMessage from '@Hooks/useMessage'
import { useQueryClient } from '@tanstack/react-query'

const { confirm } = Modal

const { Content } = Layout
const { Text, Title } = Typography

const LearnerHeader: React.FC = () => {
  const {
    mutate: logoutLearner,
    isLoading: loggingOut
  } = Learner.Queries.useLogoutLearner()
  const qc = useQueryClient();
  const {data:user,isLoading: loadingUserDetails } = Learner.Queries.useGetLearnerDetails();
  const isSignedIn = Store.useAuthentication(state => state.isSignedIn);
  const message = useMessage();
  const enrolledProducts = {
    test: user.enrolledProducts.filter(i => i.enrolledProduct.type === 'test'),
    event: user.enrolledProducts.filter(i => i.enrolledProduct.type === 'event'),
    course: user.enrolledProducts.filter(i => i.enrolledProduct.type === 'course'),
  };
  
  const { data: { items } } = Learner.Queries.useGetCartDetails()
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
        logoutLearner({
          onSuccess: () => {
            message.open({
              type: 'success',
              content:'Logged Out successfully.'
            })
            navigate('../app/store')
          }
        })
      },
      okText: 'Yes, Logout'
    })
  }
  const menuItems = useMemo(() => {
    const MENU_ITEMS = [
      { label: 'Home', key: 'store', icon: <ShopOutlined /> },
    ];
    if (enrolledProducts.test && enrolledProducts.test.length) {
      MENU_ITEMS.push({ label: 'My Tests', key: 'test', icon: <EditOutlined /> })
    }
    if (enrolledProducts.event && enrolledProducts.event.length) {
      MENU_ITEMS.push({ label: 'My Events', key: 'event', icon: <EditOutlined /> })
    }
    if (enrolledProducts.course && enrolledProducts.course.length) {
      MENU_ITEMS.push({ label: 'My Courses', key: 'courses', icon: <EditOutlined /> })
    }

    if (isMobileOrTablet && isSignedIn) {
      MENU_ITEMS.unshift({
        label: 'My Account',
        key: 'account',
        icon: <UserOutlined />
      })
    }
    return MENU_ITEMS;
    
  }, [isMobileOrTablet, isSignedIn, enrolledProducts]);
  
  // Define the extraContent
  const extraContent = (
    <Space>
      {isMobileOrTablet ? (
        <>
        {isSignedIn?    <ActionDrawer width={300}
          extra={closeDrawer => [
            <Button
            icon={<LogoutOutlined />}
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
        </ActionDrawer>:null}
        </>
      ) : null}
{!isSignedIn?<ActionModal
          width={300}
          // title="Login"
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
        </ActionModal>:null}
      {isSignedIn &&
        !isMobileOrTablet && (
          <Space>
            {!screen.isMobile ? (
              <Badge count={items?.length || 0} showZero={false}>
              <NavLink to={`../app/cart`} children={({isActive}) => {
                return <Button
                type={isActive?'primary':'default'}
                shape="circle"
                icon={<ShoppingCartOutlined />}
              />
              }} />
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
                    onClick={() => logout()}
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
