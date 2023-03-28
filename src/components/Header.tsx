/*eslint-disable */

import { Col, Input, Layout, Row, Space, Typography } from 'antd'

import { PageHeaderProps } from '@ant-design/pro-layout'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'

interface HeaderPropsI extends PageHeaderProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  hideBack?: boolean;
  extra?: React.ReactNode[];
  theme?: string;
  bgColor?: string;
}
const { Title } = Typography
const { Header: PageHeader } = Layout
const { Search } = Input

const CustomHeader = styled(PageHeader)(
  props => `
  ${
    props.theme === 'dark'
      ? `
.custom-header{
  .ant-space-horizontal {
    background: #212041;
  }
  .ant-divider {
    background: #fff;
  }
  .ant-typography {
    color: white;
  }
}`
      : ``
  }
 
`
)

function Header(props: HeaderPropsI) {
  const navigate = useNavigate()
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <CustomHeader
          theme={props.theme}
          style={{
            background: props.bgColor ? props.bgColor : '#fff',
            border: `1px solid #ececec`,
            padding: '0 20px'
          }}
          // {...props}
          // backIcon={!props.hideBack}
          // onBack={() => navigate(-1)}
          // extra={props.extra}
          // title={props.title}
        >
          <Space
            className="custom-header"
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Space align="center">
              <Title style={{ margin: '10px 0' }} level={4}>
                {props.title}
              </Title>
            </Space>
            <Space>{props.extra}</Space>
          </Space>
          <Row gutter={[40, 40]} style={{ marginTop: '20px' }}>
            <Col span={24}>{props.children}</Col>
          </Row>
        </CustomHeader>
      </Col>
    </Row>
  )
}

export default Header
