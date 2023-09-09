import {
    AutoComplete,
    Avatar,
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
import { Learner, Store, Types } from '@adewaskar/lms-common'
import { Outlet, useNavigate } from 'react-router'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import Header from '@Components/Header'
import Image from '@Components/Image'
import { Link } from 'react-router-dom'
import LoginScreen from '@Learner/Screens/Login'
import OrgLogo from '@Components/OrgLogo'
import { PageHeaderProps } from '@ant-design/pro-layout';
import Search from 'antd/es/input/Search'
import { useState } from 'react'

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
  
  const UserHeader: React.FC<HeaderPropsI> = (props) => {
    const { data: { items } } = Learner.Queries.useGetCartDetails();
    const { mutate: logoutLearner } = Learner.Queries.useLogoutLearner()
    const [text, setText] = useState('')
    const {
      data: searchedCourses,
      isLoading: loading
    } = Learner.Queries.useGetCoursesOfOrganisation({
      searchValue: text
    })
    const { isSignedIn } = Store.useAuthentication(state => state)
  
    const listItems = searchedCourses.map(c => {
      const instructor = c.instructor as  unknown as Types.Instructor;
      return {
        label: (
          <Space
            align="center"
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            {/* <Avatar
              shape="square"
              style={{ background: 'transparent' }}
              size={45}
              icon={<Image src={c.thumbnailImage} />}
            />{' '} */}
            <Space direction="vertical" align="baseline">
              <Title style={{ margin: 0 }} level={5}>
                {c.title}
              </Title>
              <Text style={{ margin: 0 }}>
                Taught By: {instructor.name}
              </Text>
            </Space>
          </Space>
        ),
        value: c.title
      }
    })
    const navigate = useNavigate()
    const logout = () => {
      logoutLearner()
    }
  
  
    return (
      <Header
        hideBack
        title={
          <Space style={{ cursor: 'pointer', paddingLeft: 10 }}>
            <OrgLogo />
            <Space style={{ display: 'flex', marginLeft: 25 }} align="center">
              <AutoComplete
                onSelect={(e,a) => console.log(e,a)}
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
                  onChange={(e: any) => setText(e.target.value)}
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
          ...(props.extra || []),
          // <Link to={`store`} style={{ margin: '0 10px' }}>
          //   <Text strong>Store</Text>
          // </Link>,
          // <Link to={`store`} style={{ margin: '0 10px' }}>
          //   <Text strong>Blogs</Text>
          // </Link>,
  
          isSignedIn ? (
            <Space>
                  {/* <Badge count={items.length} showZero={false}>
                <Button
                  onClick={() => {
                    navigate('cart')
                  }}
                  type="primary"
                  shape="circle"
                  icon={<ShoppingCartOutlined />}
                />
              </Badge> */}
              <Dropdown  trigger={['click']}
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
  
  export default UserHeader
  