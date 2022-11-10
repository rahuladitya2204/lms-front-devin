import { Card, Layout, Menu, Tabs } from 'antd'
import React, { useState } from 'react'

import LogoImage from './logo.svg'
import styled from '@emotion/styled'
import Header from '@Components/Header'

const LearnerCourses: React.FC = () => {
  return (
    <Header title="My Courses">
      <Card>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="All Courses" key="1">
            Content of Tab Pane 1
          </Tabs.TabPane>
          <Tabs.TabPane tab="Wishlist" key="2">
            Content of Tab Pane 2
          </Tabs.TabPane>
          <Tabs.TabPane tab="Archived" key="3">
            Content of Tab Pane 3
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </Header>
  )
}

export default LearnerCourses
