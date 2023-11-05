import { Col, Row, Space } from 'antd'

import BackButton from './BackButton'
import { PageHeaderProps } from '@ant-design/pro-layout'
import React from 'react'
import styled from '@emotion/styled'

interface HeaderPropsI extends PageHeaderProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  showBack?: boolean;
  hideBack?: boolean;
  extra?: React.ReactNode;
  theme?: string;
  bgColor?: string;
}

const StyledHeader =
  styled.header <
  HeaderPropsI >
  `
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  // background: ${props => props.bgColor || '#fff'};
  border-bottom: 1px solid #ececec;
`

const Title = styled.h2`
  margin: 10px 0;
`

const CustomRow = styled.div`
  display: flex;
  width: 100%;
`

const CustomCol = styled.div`
  flex: 1;
`

const Header: React.FC<HeaderPropsI> = props => {
  return (
    <CustomRow>
      <CustomCol>
        <StyledHeader bgColor={props.bgColor}>
          <Row justify={'space-between'} style={{ flex: 1 }}>
            <Col>
              <Space align="center">
                {props.showBack ? <BackButton /> : null}
                <Title style={{ margin: '10px 0' }}>{props.title}</Title>
              </Space>
            </Col>
            <Col
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {/* You would include your BackButton or equivalent control here */}
              {/* Render extra props content */}
              {props.extra}
            </Col>
          </Row>
        </StyledHeader>
        {/* Rest of the content */}
        <div style={{ padding: '30px 0' }}>{props.children}</div>
      </CustomCol>
    </CustomRow>
  )
}

export default Header
