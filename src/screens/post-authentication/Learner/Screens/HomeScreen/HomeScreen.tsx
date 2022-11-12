import { Col, Row } from 'antd'
import { useParams } from 'react-router-dom'

import { useEffect } from 'react'

import { saveItemToStorage } from '@Utils/storage'

import { useGetCoursesOfOrganisation } from '@Learner/Api/queries'
import CourseCard from './CourseCard'

function LearnerHomeScreen () {
  const { data: courses } = useGetCoursesOfOrganisation()

  const params = useParams()
  useEffect(
    () => {
      saveItemToStorage('orgId', params.orgId + '')
    },
    [params.orgId]
  )

  return (
    <Row gutter={[40, 40]}>
      <Col span={3} />
      <Col span={18}>
        {courses.map(course => {
          return (
            <Col span={8}>
              <CourseCard course={course} />
            </Col>
          )
        })}
      </Col>
      <Col span={3} />
    </Row>
  )
}

export default LearnerHomeScreen
