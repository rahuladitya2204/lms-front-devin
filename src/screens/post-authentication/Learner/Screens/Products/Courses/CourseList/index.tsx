import { Col, Row } from 'antd'
import React, { Fragment } from 'react'

import CourseCard from './CourseCard'
import { Learner } from '@adewaskar/lms-common'
import { useNavigate } from 'react-router'

const LearnerCourseList: React.FC = () => {
  const { data: enrolledCourses } = Learner.Queries.useGetEnrolledCourses()
  console.log(enrolledCourses, 'enrolledCourses')
  const navigate = useNavigate()
  return (
    <Fragment>
      <Row gutter={[30, 30]}>
        {enrolledCourses.map(
          ({ product, enrolledAt, metadata: { progress } }) => (
            <Col span={6}>
              <CourseCard
                onClick={() => navigate(`../enrolled-courses/${product.id}`)}
                courseId={product.id}
                enrolledAt={enrolledAt}
                progress={progress}
              />
            </Col>
          )
        )}
      </Row>
    </Fragment>
  )
}

export default LearnerCourseList
