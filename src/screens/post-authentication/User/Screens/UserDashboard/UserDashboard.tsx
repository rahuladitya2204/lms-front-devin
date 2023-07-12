import { Card, Col, Layout, Menu, Row, Statistic } from 'antd'
import { Outlet, useNavigate } from 'react-router'
import React, { useState } from 'react'

import AppProvider from 'screens/AppProvider'
import { ArrowDownOutlined } from '@ant-design/icons'
import Header from '@Components/Header'
import LogoImage from './logo.svg'
import ThemeProvider from 'screens/ThemeProvider'
import styled from '@emotion/styled'

const { Content, Sider } = Layout

const UserDashboard: React.FC = () => {
  const navigate = useNavigate()
  return (
    <Header title="Dashboard">
      <Row gutter={[30, 30]}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Revenue"
              value={`1080123`}
              precision={2}
              // valueStyle={{ color: '#cf1322' }}
              prefix={`$`}
              // suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="New Signups"
              value={`1080123`}
              precision={2}
              // valueStyle={{ color: '#cf1322' }}
              // prefix={`$`}
              // suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="New Enrollments"
              value={`1080123`}
              precision={2}
              // valueStyle={{ color: '#cf1322' }}
              // prefix={`$`}
              // suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </Header>
  )
}

export default UserDashboard
