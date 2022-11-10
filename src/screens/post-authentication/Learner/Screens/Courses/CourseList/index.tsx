import { Avatar, Card, Col, Layout, Menu, Row, Tabs } from 'antd'
import React, { useState } from 'react'

import Header from '@Components/Header'
import { useGetCourses } from '@Learner/Api/queries'
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined
} from '@ant-design/icons'
import Meta from 'antd/lib/card/Meta'
import CourseCard from './CourseCard'

const LearnerCourseList: React.FC = () => {
  const { data: courses } = useGetCourses()
  console.log(courses, 'courses')
  return (
    <Row>
      <Col span={6}>
        {courses.map(course => <CourseCard course={course} />)}
      </Col>
    </Row>
  )
}

export default LearnerCourseList
