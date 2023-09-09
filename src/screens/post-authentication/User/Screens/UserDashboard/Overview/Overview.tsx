import { Card, Col, Layout, Menu, Row, Segmented, Statistic } from 'antd'
import { Outlet, useNavigate } from 'react-router'
import React, { useState } from 'react'

import ActiveUsers from '../Stats/ActiveUsers'
import AppProvider from 'screens/AppProvider'
import { ArrowDownOutlined } from '@ant-design/icons'
import Header from '@Components/Header'
import LogoImage from './logo.svg'
import NewSignups from '../Stats/NewSignups'
import PaidUsers from '../Stats/PaidUsers'
import ThemeProvider from 'screens/ThemeProvider'
import Transactions from '../Stats/Transactions'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import styled from '@emotion/styled'

const DATE_RANGES = [
  { name: '7 Days', id: 7 },
  { name: '30 Days', id: 30 },
  { name: '90 Days', id: 90 },
  { name: '1 year', id: 365 }
]

const DashboardOverview: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState('7 Days')
  const selectedValue = DATE_RANGES.find(i => i.name === selectedRange)?.id || 7
  const startDate = dayjs()
    .subtract(selectedValue, 'day')
    .startOf('day')
    .toISOString()
  const endDate = dayjs()
    .endOf('day')
    .toISOString()
  const { data: Analytics, isLoading } = User.Queries.useGetOverviewReport({
    startDate,
    endDate
  })
  return (
    <Row gutter={[30, 30]}>
      <Col span={24}>
        <Row gutter={[30, 30]}>
          <Col
            span={24}
            style={{ display: 'flex', flexDirection: 'row-reverse' }}
          >
            <Segmented
              // @ts-ignore
              onChange={e => setSelectedRange(e)}
              value={selectedRange}
              options={DATE_RANGES.map(r => r.name)}
            />
          </Col>
          <Col span={8}>
            <Card style={{height: 160}} loading={isLoading} bordered={false}>
              <Statistic
                title="Total Revenue"
                value={Analytics?.totalRevenue}
                // precision={2}
                // valueStyle={{ color: '#cf1322' }}
                prefix={`₹`}
                // suffix="%"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{height: 160}} loading={isLoading} bordered={false}>
              <Statistic
                title="New Signups"
                value={Analytics?.totalNewSignups}
                // precision={2}
                // valueStyle={{ color: '#cf1322' }}
                // prefix={`$`}
                // suffix="%"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{height: 160}} loading={isLoading} bordered={false}>
              <Statistic
                title="New Enrollments"
                value={Analytics?.totalActiveUsers}
                // valueStyle={{ color: '#cf1322' }}
                // prefix={`$`}
                // suffix="%"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{height: 160}} loading={isLoading} bordered={false}>
              <Statistic
                title="Active Users"
                value={Analytics?.totalActiveUsers}
                // valueStyle={{ color: '#cf1322' }}
                // prefix={`$`}
                // suffix="%"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card style={{height: 160}} loading={isLoading} bordered={false}>
              <Statistic
                title="Total Time Spent"
                value={Analytics?.totalActiveUsers}
                // valueStyle={{ color: '#cf1322' }}
                // prefix={`$`}
                // suffix="%"
              />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[30, 30]}>
          <Col span={12}>
            <Card loading={isLoading} title="Revenue">
              <NewSignups />
            </Card>
          </Col>
          <Col span={12}>
            <Card loading={isLoading} title="Transactions">
              <Transactions />
            </Card>
          </Col>
          <Col span={12}>
            <Card loading={isLoading} title="Active Users">
              <ActiveUsers />
            </Card>
          </Col>
          <Col span={12}>
            <Card loading={isLoading} title="Paid Users">
              <PaidUsers />
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default DashboardOverview
