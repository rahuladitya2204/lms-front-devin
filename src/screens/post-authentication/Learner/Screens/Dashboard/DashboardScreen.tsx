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
} from 'antd'
import { Outlet, useNavigate } from 'react-router'

import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import Header from '@Components/Header'
import { useGetCartItems } from '@Learner/Api/Common/queries'

const { Content } = Layout
const { Text } = Typography

const LearnerDashboard: React.FC = () => {
  const { data: cartItems } = useGetCartItems()
  const navigate = useNavigate()
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout className="site-layout">
        <Header
          avatar={{
            src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4'
          }}
          // title={'SKOLA'}
          extra={[
            <Link to={`store`} style={{ margin: '0 10px' }}>
              <Text strong>Store</Text>
            </Link>,
            <Link to={`courses`} style={{ margin: '0 10px' }}>
              <Text strong>Courses</Text>
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
              <Col span={3} />
              <Col span={18}>
                <Outlet />
              </Col>
              <Col span={3} />
            </Row>
          </Content>
        </Header>

        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  )
}

export default LearnerDashboard
