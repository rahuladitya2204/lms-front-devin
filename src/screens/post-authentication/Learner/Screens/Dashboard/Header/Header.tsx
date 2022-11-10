/*eslint-disable */

import { Anchor, Col, PageHeader, Row } from 'antd'

import { MenuUnfoldOutlined } from '@ant-design/icons'
import useGlobal from '@Store/useGlobal'

interface HeaderPropsI {
  children?: React.ReactNode;
  title?: string;
  extra?: React.ReactNode[];
}

function Header(props: HeaderPropsI) {
  const { isDrawerOpen, setDrawerOpen } = useGlobal(state => state)
  return (
    <Row>
      <Col span={24}>
        <PageHeader
          onBack={() => null}
          extra={props.extra}
          title={props.title || 'LMS'}
          backIcon={false}
        >
          {props.children}
        </PageHeader>
      </Col>
    </Row>
  )
}

export default Header
