import { Col, Row } from 'antd'
import React, { Fragment, useState } from 'react'

import CourseCard from './CourseCard'
import { Learner } from '@adewaskar/lms-common'
import { useNavigate } from 'react-router'

const LearnerCourseList: React.FC = () => {
  const { data: courses } = Learner.Queries.useGetEnrolledCourses()
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
