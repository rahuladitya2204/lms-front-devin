import { Col, Row } from 'antd'
import React, { Fragment } from 'react'

import CourseCard from './CourseCard'
import { Learner } from '@adewaskar/lms-common'
import { useNavigate } from 'react-router'

const LearnerCourseList: React.FC = () => {
  const { data: enrolledCourses } = Learner.Queries.useGetEnrolledCourses()

  const navigate = useNavigate()
  return (
    <Fragment>
      <Row gutter={[30, 30]}>
        {enrolledCourses.map(({ course, progress, enrolledAt }) => (
          <Col span={6}>
            <CourseCard
              onClick={() => navigate(`${course._id}/player`)}
              course={course}
              enrolledAt={enrolledAt}
              progress={progress}
            />
          </Col>
        ))}
      </Row>
    </Fragment>
  )
}

export default LearnerCourseList
