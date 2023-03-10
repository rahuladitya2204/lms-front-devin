import { Col, Row } from 'antd'

import CourseCard from './CourseCard'
import { Learner } from '@adewaskar/lms-common'
import { Utils } from '@adewaskar/lms-common'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function StoreScreen () {
  const { data: courses } = Learner.Queries.useGetCoursesOfOrganisation()
  // const { listItems: instructors } = useGetInstructors()
  const params = useParams()
  useEffect(
    () => {
      Utils.Storage.SetItem('orgId', params.orgId + '')
    },
    [params.orgId]
  )

  return (
    <Row gutter={[30, 30]}>
      {/* <Col span={24}>
        <Row gutter={[20, 20]}>
          <Col span={10}>
            <Text strong style={{ fontSize: 20 }}>
              We found {courses.length} courses
            </Text>
          </Col>
          <Col span={6}>
            <Search
              placeholder="Search courses"
              allowClear
              // onSearch={onSearch}
              // style={{ width: 200 }}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Select Instructor"
              style={{ width: 200 }}
              options={instructors}
            />
          </Col>
        </Row>
      </Col> */}
      <Col span={24}>
        <Row gutter={[30, 30]}>
          {courses.map(course => {
            return (
              <Col span={6}>
                <CourseCard course={course} />
              </Col>
            )
          })}
        </Row>
      </Col>
    </Row>
  )
}

export default StoreScreen
