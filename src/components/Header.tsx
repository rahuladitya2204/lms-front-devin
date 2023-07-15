/*eslint-disable */

import { Button, Col, Input, Layout, Row, Space, Typography } from 'antd'

import { ArrowLeftOutlined } from '@ant-design/icons'
import BackButton from './BackButton'
import { PageHeaderProps } from '@ant-design/pro-layout'
import styled from '@emotion/styled'

interface HeaderPropsI extends PageHeaderProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  showBack?: boolean;
  hideBack?: boolean;
  extra?: React.ReactNode[];
  theme?: string;
  bgColor?: string;
}
const { Title } = Typography

function Header(props: HeaderPropsI) {
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Layout.Header
          style={{
            background: props.bgColor ? props.bgColor : '#fff',
            border: `1px solid #ececec`,
            padding: '0 20px'
          }}
        >
          <Space
            className="custom-header"
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Space align="center">
              {props.showBack ? <BackButton /> : null}
              <Title style={{ margin: '10px 0' }} level={4}>
                {props.title}
              </Title>
            </Space>
            <Space>{props.extra}</Space>
          </Space>
          <Row gutter={[40, 40]} style={{ marginTop: '20px' }}>
            <Col span={24}>{props.children}</Col>
          </Row>
        </Layout.Header>
      </Col>
    </Row>
  )
}

export default Header
