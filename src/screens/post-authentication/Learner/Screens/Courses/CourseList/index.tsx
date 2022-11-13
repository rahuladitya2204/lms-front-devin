import { Avatar, Card, Col, Layout, Menu, Row, Tabs } from 'antd'
import React, { useState } from 'react'

import { useGetCourses } from '@Learner/Api/queries'

import CourseCard from './CourseCard'
import { useNavigate } from 'react-router'

const LearnerCourseList: React.FC = () => {
  const { data: courses } = useGetCourses()
  const navigate = useNavigate()
  return (
    <Row>
      {courses.map(course => (
        <Col span={5}>
          <CourseCard
            onClick={() => navigate(`${course._id}/player`)}
            course={course}
          />
        </Col>
      ))}
    </Row>
  )
}

export default LearnerCourseList
