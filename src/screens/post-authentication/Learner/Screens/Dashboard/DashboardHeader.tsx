// @ts-nocheck
import {
  AutoComplete,
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
  Input,
  Layout,
  Menu,
  Row,
  Space,
  Typography
} from 'antd'
import { Learner, Store } from '@adewaskar/lms-common'
import { Outlet, useNavigate } from 'react-router'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import Header from '@Components/Header'
import Image from '@Components/Image'
import { Link } from 'react-router-dom'
import LoginScreen from '@Learner/Screens/Login'
import Search from 'antd/es/input/Search'
import { useState } from 'react'

const { Content } = Layout
const { Text, Title } = Typography

const DashboardHeader: React.FC = () => {
  const { data: cartItems } = Learner.Queries.useGetCartItems()
  const { mutate: logoutLearner } = Learner.Queries.useLogoutLearner()
  const [text, setText] = useState(null)
  const {
    data: searchedCourses,
    isLoading: loading
  } = Learner.Queries.useGetCoursesOfOrganisation({
    searchValue: text
  })
  const { isSignedIn } = Store.useAuthentication(state => state)

  const listItems = searchedCourses.map(c => ({
    label: (
      <Space
        align="center"
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Avatar
          shape="square"
          style={{ background: 'transparent' }}
          size={45}
          icon={<Image src={c.thumbnailImage} />}
        />{' '}
        <Space direction="vertical" align="baseline">
          <Title style={{ margin: 0 }} level={5}>
            {c.title}
          </Title>
          <Text style={{ margin: 0 }} level={5}>
            Taught By: {c.instructor.name}
          </Text>
        </Space>
      </Space>
    ),
    value: c.title
  }))
  console.log(searchedCourses, 'searchedCoursessearchedCourses')
  const navigate = useNavigate()
  const logout = () => {
    logoutLearner()
  }
  return (
    <Header
      hideBack
      title={
        <Space style={{ cursor: 'pointer', paddingLeft: 10 }}>
          <Image
            onClick={() => navigate('/learner/123123/dashboard/store')}
            style={{ cursor: 'pointer' }}
            width={40}
            preview={false}
            src={
              'https://asset-cdn.learnyst.com/assets/schools/110998/schoolLogo/soiclogolearnyst_r5jz9f.png'
            }
          />
          <Space style={{ display: 'flex', marginLeft: 25 }} align="center">
            <AutoComplete
              onSelect={e => console.log(e)}
              popupClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={500}
              style={{ width: 250 }}
              options={listItems}
            >
              <Search
                placeholder="Search for courses.."
                allowClear
                value={text}
                loading={loading}
                onChange={e => setText(e.target.value)}
                onSearch={e => console.log(e, 'eee')}
                style={{ width: 500 }}
              />
            </AutoComplete>
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
                <Text strong>My Courses</Text>
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
            <Dropdown
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
                  <Menu.Item onClick={logout}>Logout</Menu.Item>
                </Menu>
              }
            >
              <Button shape="circle" icon={<UserOutlined />} />
            </Dropdown>
            <Badge count={cartItems.length} showZero={false}>
              <Button
                onClick={() => {
                  navigate('cart')
                }}
                type="primary"
                shape="circle"
                icon={<ShoppingCartOutlined />}
              />
            </Badge>
          </Space>
        ) : null
      ]}
      className="site-layout-background"
      style={{ padding: 0 }}
    >
      <Content style={{ margin: '0 16px' }}>
        <Row style={{ paddingTop: 20 }}>
          <Col span={2} />
          <Col span={20}>
            <Outlet />
          </Col>
          <Col span={2} />
        </Row>
      </Content>
    </Header>
  )
}

export default DashboardHeader
