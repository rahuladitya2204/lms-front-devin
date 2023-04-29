import { Card, Col, Layout, Menu, Row } from 'antd'
import { Outlet, useNavigate } from 'react-router'
import React, { useState } from 'react'

import AppProvider from 'screens/AppProvider'
import Header from '@Components/Header'
import LogoImage from './logo.svg'
import ThemeProvider from 'screens/ThemeProvider'
import styled from '@emotion/styled'

const LogoHolder = styled.div`
  padding: 20px;
`

const Logo = styled.img`
  width: 115px;
  margin: auto;
  display: block;
`

const { Content, Sider } = Layout

const UserDashboard: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  // const { colorPallete } = Store.useGlobal(s => s)
  const navigate = useNavigate()
  return (
    <Header title='Dashboard'>
      <Card
        bodyStyle={{ padding: 0 }}
        // title={'Packages'}
        // extra={
        //   <ActionModal cta={<Button type="primary">Create New Package</Button>}>
        //     <AddPackage> </AddPackage>
        //   </ActionModal>
        // }
      >
        <Row>
          <Col span={24} >123</Col>
        </Row>
      </Card>
    </Header>
  )
}

export default UserDashboard
