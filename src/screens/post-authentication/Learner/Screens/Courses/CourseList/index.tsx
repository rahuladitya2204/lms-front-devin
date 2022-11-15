import {
  Avatar,
  Card,
  Col,
  Input,
  Layout,
  Menu,
  Row,
  Select,
  Tabs,
  Typography
} from 'antd'
import React, { Fragment, useState } from 'react'

import { useGetCourses } from '@Learner/Api/queries'

import CourseCard from './CourseCard'
import { useNavigate } from 'react-router'

const { Text } = Typography
const { Search } = Input

const LearnerCourseList: React.FC = () => {
  const { data: courses } = useGetCourses()
  const navigate = useNavigate()
  return (
    <Fragment>

      <Row gutter={[30,30]}>
        {courses.map(course => (
          <Col span={5}>
            <CourseCard
              onClick={() => navigate(`${course._id}/player`)}
              course={course}
            />
          </Col>
        ))}
      </Row>
    </Fragment>
  )
}

export default LearnerCourseList
