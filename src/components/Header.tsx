/*eslint-disable */

import { Col, PageHeader, PageHeaderProps, Row } from 'antd'

import useGlobal from '@Store/useGlobal'
import { HTMLAttributes } from 'react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router'

interface HeaderPropsI extends PageHeaderProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  hideBack?: boolean;
  extra?: React.ReactNode[];
  bgColor?: string;
}

const CustomHeader = styled(PageHeader)`
  .ant-page-header-heading {
    padding: 12px;
    background-color: ${(props: { bgColor?: string }) =>
      props.bgColor ? props.bgColor : ''};
  }
`

function Header(props: HeaderPropsI) {
  const navigate = useNavigate()
  return (
    <Row>
      <Col span={24}>
        <CustomHeader
          {...props}
          backIcon={!props.hideBack}
          onBack={() => navigate(-1)}
          extra={props.extra}
          title={props.title}
        >
          {props.children}
        </CustomHeader>
      </Col>
    </Row>
  )
}

export default Header
