/*eslint-disable */

import { Col, PageHeader, PageHeaderProps, Row } from 'antd'

import useGlobal from '@Store/useGlobal'
import { HTMLAttributes } from 'react'
import styled from '@emotion/styled'

interface HeaderPropsI extends PageHeaderProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  extra?: React.ReactNode[];
  bgColor?: string;
}

const CustomHeader = styled(PageHeader)`
  .ant-page-header-heading {
    padding: 12px;
    background-color: ${(props: { bgColor?: string }) =>
      props.bgColor ? props.bgColor : '#fff'};
  }
`

function Header(props: HeaderPropsI) {
  const { isDrawerOpen, setDrawerOpen } = useGlobal(state => state)
  return (
    <Row>
      <Col span={24}>
        <CustomHeader
          theme={'dark'}
          {...props}
          onBack={() => null}
          extra={props.extra}
          title={props.title}
          backIcon={false}
        >
          {props.children}
        </CustomHeader>
      </Col>
    </Row>
  )
}

export default Header
