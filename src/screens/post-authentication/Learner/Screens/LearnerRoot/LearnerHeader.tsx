import {
  AutoComplete,
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
  Layout,
  Menu,
  Modal,
  Row,
  Space,
  Spin,
  Typography
} from 'antd'
import { Learner, Store, Types } from '@adewaskar/lms-common'
import { Outlet, useNavigate } from 'react-router'
import {
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import Header from '@Components/Header'
import Image from '@Components/Image'
import { Link } from 'react-router-dom'
import LoginScreen from '@Learner/Screens/Login'
import OrgLogo from '@Components/OrgLogo'
import SearchLearnerCourses from '@Components/SearchLearnerCourses'

const { confirm } = Modal

const { Content } = Layout
const { Text, Title } = Typography

const LearnerHeader: React.FC = () => {
  const {
    mutate: logoutLearner,
    isLoading: loggingOut
  } = Learner.Queries.useLogoutLearner()

  const { isSignedIn } = Store.useAuthentication(state => state)

  const { data: { items } } = Learner.Queries.useGetCartDetails({
    enabled: !!isSignedIn
  })

  const navigate = useNavigate()
  const logout = () => {
    confirm({
      title: 'Are you sure?',
      icon: <LogoutOutlined />,
      content: `You want to logout?`,
      onOk() {
        logoutLearner(undefined, {
          onSuccess: () => {
            // navigate('../app/store')
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
          <Space style={{ display: 'flex', marginLeft: 25 }} align="center">
            <SearchLearnerCourses />
          </Space>
          {/* <Search
              placeholder="Search Courses"
              // onSearch={onSearch}
              style={{ width: 200 }}
            /> */}
        </Space>
      }
      bgColor="#fff"
      extra={[
        <Link to={`store`} style={{ margin: '0 10px' }}>
          <Text strong>Store</Text>
        </Link>,
        <Link to={`store`} style={{ margin: '0 10px' }}>
          <Text strong>Blogs</Text>
        </Link>,
        ...(isSignedIn
          ? [
              <Link to={`courses`} style={{ margin: '0 10px' }}>
                <Text strong>Courses</Text>
              </Link>,
              <Link to={`test`} style={{ margin: '0 10px' }}>
                <Text strong>Tests</Text>
              </Link>,
              <Link to={`event`} style={{ margin: '0 10px' }}>
                <Text strong>Events</Text>
              </Link>
            ]
          : [
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
