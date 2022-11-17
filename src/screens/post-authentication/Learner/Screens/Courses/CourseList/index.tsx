import { Col, Row } from 'antd'
import React, { Fragment, useState } from 'react'

import CourseCard from './CourseCard'
import { useNavigate } from 'react-router'
import { useGetEnrolledCourses } from '@Learner/Api/Course/queries'

const LearnerCourseList: React.FC = () => {
  const { data: courses } = useGetEnrolledCourses()
  console.log(courses, 'cococococ')
  const navigate = useNavigate()
  return (
    <Fragment>
      <Row gutter={[30, 30]}>
        {courses.map(({ course, progress }) => (
          <Col span={6}>
            <CourseCard
              onClick={() => navigate(`${course._id}/player`)}
              course={course}
              progress={progress || 0}
            />
          </Col>
        ))}
      </Row>
    </Fragment>
  )
}

export default LearnerCourseList
