import { Card, Col, Row, Skeleton } from 'antd'
import React, { Fragment } from 'react'

import CourseCard from './CourseCard'
import { Learner } from '@adewaskar/lms-common'
import { useNavigate } from 'react-router'

const LearnerCourseList: React.FC = () => {
  const {
    data: enrolledCourses,
    isLoading: loading
  } = Learner.Queries.useGetEnrolledCourses()
  console.log(enrolledCourses, 'enrolledCourses')
  const navigate = useNavigate()
  if (loading) {
    const SkeletonArr = [1, 1, 1, 1, 1, 1, 1, 1]
    return (
      <Row gutter={[60, 100]}>
        {SkeletonArr.map(() => (
          <Col span={6}>
            <Card>
              <Skeleton active paragraph />
              <Skeleton.Avatar />
              {/* <Row justify={'space-between'}>
                <Col>
                  <Skeleton.Button style={{ marginTop: 20 }} block />
                </Col>
                <Col>
                  <Skeleton.Button style={{ marginTop: 20 }} block />
                </Col>
                <Col>
                  <Skeleton.Button style={{ marginTop: 20 }} block />
                </Col>
              </Row>{' '} */}
            </Card>{' '}
          </Col>
        ))}
      </Row>
    )
  }
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
