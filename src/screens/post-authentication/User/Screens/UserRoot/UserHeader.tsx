import {
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
import {
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Outlet, useNavigate } from 'react-router'
import { Store, User } from '@adewaskar/lms-common'

import Header from '@Components/Header'
import OrgLogo from '@Components/OrgLogo'
import { PageHeaderProps } from '@ant-design/pro-layout'

const { confirm } = Modal

interface HeaderPropsI extends PageHeaderProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  showBack?: boolean;
  hideBack?: boolean;
  extra?: React.ReactNode[];
  theme?: string;
  bgColor?: string;
}

const { Content } = Layout
const { Text, Title } = Typography

const UserHeader: React.FC<HeaderPropsI> = props => {
  const {
    mutate: logoutUser,
    isLoading: loggingOut
  } = User.Queries.useLogoutUser()
  const navigate = useNavigate()

  const { isSignedIn } = Store.useAuthentication(state => state)

  const logout = () => {
    confirm({
      title: 'Are you sure?',
      icon: <LogoutOutlined />,
      content: `You want to logout?`,
      onOk() {
        logoutUser(undefined, {
          onSuccess: () => {
            console.log('Loggin out')
            navigate('../../../login')
          }
        })
      },
      okText: 'Yes, Logout'
    })
  }
  const extraContent = isSignedIn ? (
    <Space>
      {/* Replace with actual items count and navigation */}
      {/* <Badge count={items.length} showZero={false}>
          <Button
            onClick={() => navigate('cart')}
            type="primary"
            shape="circle"
            icon={<ShoppingCartOutlined />}
          />
        </Badge> */}
      <Dropdown
        trigger={['click']}
        placement="bottomLeft"
        overlay={
          <Menu>
            <Menu.Item onClick={() => navigate('account')}>
              My Account
            </Menu.Item>
            <Menu.Item onClick={() => navigate('tickets')}>
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

  return (
    <Header
      hideBack
      title={
        <Space style={{ cursor: 'pointer', paddingLeft: 10 }}>
          {/* <OrgLogo /> */}
          <Title style={{ margin: 0 }} level={3}>
            {props.title}
          </Title>
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
            <Col span={24} style={{ padding: '0 30px' }}>
              {props.children}
            </Col>
          </Row>
        </Spin>
      </Content>
    </Header>
    // <Header
    //   hideBack
    //   title={
    // <Space style={{ cursor: 'pointer', paddingLeft: 10 }}>
    //   {/* <OrgLogo /> */}
    //   {props.title}
    // </Space>
    //   }
    //   bgColor="#fff"
    //   extra={[
    //     ...(props.extra || []),
    //     // <Link to={`store`} style={{ margin: '0 10px' }}>
    //     //   <Text strong>Store</Text>
    //     // </Link>,
    //     // <Link to={`store`} style={{ margin: '0 10px' }}>
    //     //   <Text strong>Blogs</Text>
    //     // </Link>,

    //     isSignedIn ? (
    //       <Space>
    //         {/* <Badge count={items.length} showZero={false}>
    //             <Button
    //               onClick={() => {
    //                 navigate('cart')
    //               }}
    //               type="primary"
    //               shape="circle"
    //               icon={<ShoppingCartOutlined />}
    //             />
    //           </Badge> */}
    //         <Dropdown
    //           trigger={['click']}
    //           placement="bottomLeft"
    //           overlay={
    //             <Menu>
    //               <Menu.Item
    //                 onClick={() => {
    //                   navigate('account')
    //                 }}
    //               >
    //                 My Account
    //               </Menu.Item>
    //               <Menu.Item
    //                 onClick={() => {
    //                   navigate('tickets')
    //                 }}
    //               >
    //                 Help and Support
    //               </Menu.Item>
    //               <Menu.Item onClick={logout}>Logout</Menu.Item>
    //             </Menu>
    //           }
    //         >
    //           <Button shape="circle" icon={<UserOutlined />} />
    //         </Dropdown>
    //       </Space>
    //     ) : null
    //   ]}
    //   className="site-layout-background"
    //   style={{ padding: 0 }}
    // >
    //   <Spin spinning={loggingOut}>
    //     <Content>
    //       <Row>
    //         <Col span={24}>{props.children}</Col>
    //       </Row>
    //     </Content>
    //   </Spin>
    // </Header>
  )
}

export default UserHeader
