import { Col, Row } from 'antd'
import React, { Fragment, useState } from 'react'

import CourseCard from './CourseCard'
import { useNavigate } from 'react-router'
import { useGetCourses } from '@Learner/Api/Course/queries'

const LearnerCourseList: React.FC = () => {
  const { data: courses } = useGetCourses()
  const navigate = useNavigate()
  return (
    <Fragment>
      <Row gutter={[30, 30]}>
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
