import { Card, Col, List, Row, Skeleton } from 'antd'
import React, { Fragment } from 'react'

import CourseCard from './CourseCard'
import { Learner } from '@invinciblezealorg/lms-common'
import { useNavigate } from 'react-router'

const LearnerCourseList: React.FC = () => {
  const {
    data: enrolledCourses,
    isFetching: loading
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
    <Row gutter={[20, 30]}>
      {enrolledCourses.map(enrolledProduct => (
        <Col xs={24} sm={12} md={8} lg={6}>
          {' '}
          <CourseCard
            onClick={() =>
              navigate(`../enrolled-courses/${enrolledProduct.product.id}`)
            }
            courseId={enrolledProduct.product.id}
            enrolledProduct={enrolledProduct}
            progress={enrolledProduct.progress}
          />
        </Col>
      ))}
    </Row>
  )
}

export default LearnerCourseList
