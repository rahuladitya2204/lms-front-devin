import { Carousel, Col, Divider, List, Row, Typography } from 'antd'
import { Learner, Store } from '@adewaskar/lms-common'

import BGImage from './image.svg'
import CourseCard from './Cards/CourseCard'
import HomeCarousel from './Carousel'
import Image from '@Components/Image'
import SearchLearnerCourses from '@Components/SearchLearnerCourses'
import Section from '@Components/Section'
import TestCard from './Cards/TestCard'
import { Utils } from '@adewaskar/lms-common'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const { Title, Paragraph } = Typography

function StoreScreen () {
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn)

  const params = useParams()
  const {
    data: { courses, liveSessions, tests }
  } = Learner.Queries.useGetRecommendedProducts()
  const { data: categories } = Learner.Queries.useGetLearnerCategories()

  useEffect(
    () => {
      Utils.Storage.SetItem('orgId', params.orgId + '')
    },
    [params.orgId]
  )

  return (
    <Row gutter={[30, 30]}>
      {/* <Col span={24}>
        <HomeCarousel />
      </Col> */}
      <Col span={24}>
        <Row align={'middle'}>
          <Col span={12} flex={1}>
            <Title>
              Find your Preferred <br /> Courses & Improve Your Skills
            </Title>
            <Paragraph>
              Build skills with courses, certificates, and degrees online from{' '}
              <br />
              world-class universities and companies.
            </Paragraph>
            <SearchLearnerCourses />
          </Col>
          <Col span={12}>
            <Image preview={false} src={BGImage} />
          </Col>
        </Row>
      </Col>
      <Divider>
        <Title>Expore our products</Title>
      </Divider>
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
                  <List
                    grid={{ gutter: 10, column: 4, sm: 6, xs: 6 }}
                    size="large"
                    dataSource={categorizedCourses}
                    renderItem={course => <CourseCard course={course} />}
                  />
                </Col>
              </Row>
            </Section>
          </Col>
        )
      })}
      {tests.length ? (
        <Col span={24}>
          <Section
            title={`Upcoming Testss`}
            // subtitle={category.description}
          >
            <Row>
              <Col span={24}>
                <List
                  grid={{ gutter: 10, column: 4, sm: 6, xs: 6 }}
                  size="large"
                  dataSource={tests}
                  renderItem={test => <TestCard test={test} />}
                />
              </Col>
            </Row>
          </Section>
        </Col>
      ) : null}
    </Row>
  )
}

export default StoreScreen
