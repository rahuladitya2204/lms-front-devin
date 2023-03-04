/*eslint-disable */

import { Col, Layout, Row, Space, Typography } from 'antd'
import { PageHeaderProps } from '@ant-design/pro-layout'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'

interface HeaderPropsI extends PageHeaderProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  hideBack?: boolean;
  extra?: React.ReactNode[];
  bgColor?: string;
}
const { Title } = Typography
const { Header: PageHeader } = Layout

const CustomHeader = styled(PageHeader)`
  /* .ant-page-header-heading {
    padding: 12px;
    background-color: ${(props: { bgColor?: string }) =>
      props.bgColor ? props.bgColor : ''};
  } */
`

function Header(props: HeaderPropsI) {
  const navigate = useNavigate()
  return (
    <Row gutter={[20,20]}>
      <Col span={24}>
        <CustomHeader
          style={{ background: props.bgColor ? props.bgColor : '#fff' }}
          // {...props}
          // backIcon={!props.hideBack}
          // onBack={() => navigate(-1)}
          // extra={props.extra}
          // title={props.title}
        >
          <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Space>
              <Title level={4}>{props.title}</Title>
            </Space>
            <Space>{props.extra}</Space>
          </Space>
          <Row gutter={[40, 40]}>
            <Col span={24}>{props.children}</Col>
          </Row>
        </CustomHeader>
      </Col>
    </Row>
  )
}

export default Header
