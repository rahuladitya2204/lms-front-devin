// @ts-nocheck
import {
  Badge,
  Button,
  Col,
  Dropdown,
  Layout,
  Menu,
  Row,
  Space,
  Typography
} from 'antd';
import { Outlet, useNavigate } from 'react-router'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

import Header from '@Components/Header'
import Image from '@Components/Image'
import { Input } from 'antd'
import { Learner } from '@adewaskar/lms-common'
import { Link } from 'react-router-dom'

const { Content } = Layout
const { Text } = Typography
const { Search } = Input

const LearnerDashboard: React.FC = () => {
  const { data: cartItems } = Learner.Queries.useGetCartItems()
  const navigate = useNavigate()
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
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
            <Link to={`courses`} style={{ margin: '0 10px' }}>
              <Text strong>My Courses</Text>
            </Link>,

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
                    <Menu.Item>item 2</Menu.Item>
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

        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  )
}

export default LearnerDashboard
