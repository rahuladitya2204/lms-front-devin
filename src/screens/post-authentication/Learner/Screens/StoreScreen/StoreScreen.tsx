import { Carousel, Col, Row } from 'antd'
import { Learner, Store } from '@adewaskar/lms-common'

import CourseCard from './CourseCard'
import HomeCarousel from './Carousel'
import Section from '@Components/Section'
import { Utils } from '@adewaskar/lms-common'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function StoreScreen () {
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn)

  const params = useParams()

  const { data: allCourses } = Learner.Queries.useGetCoursesOfOrganisation()
  const {
    data: recommendedCourses
  } = Learner.Queries.useGetRecommendedCourses()
  const { data: categories } = Learner.Queries.useGetLearnerCategories()

  useEffect(
    () => {
      Utils.Storage.SetItem('orgId', params.orgId + '')
    },
    [params.orgId]
  )
  const courses = !isSignedIn ? recommendedCourses : allCourses
  console.log(categories, courses, 'categorizedCourses')
  return (
    <Row gutter={[30, 30]}>
      <Col span={24}>
        <HomeCarousel />
      </Col>
      {categories.map(category => {
        const categorizedCourses = courses.filter(
          course => course.category === category._id
        )
        if (!categorizedCourses.length) {
          return null
        }
        return (
          <Col span={24}>
            <Section title={category.title} subtitle={category.description}>
              <Row>
                <Col span={24}>
                  <Row gutter={[30, 30]}>
                    {categorizedCourses.map(course => {
                      return (
                        <Col span={6}>
                          <CourseCard course={course} />
                        </Col>
                      )
                    })}
                  </Row>
                </Col>
              </Row>
            </Section>
          </Col>
        )
      })}
    </Row>
  )
}

export default StoreScreen
