import { Calendar, Carousel, Col, Divider, List, Row, Typography } from 'antd'
import { Learner, Store } from '@adewaskar/lms-common'

import BGImage from './image.svg'
import CourseCard from './Cards/CourseCard'
import EventCard from './Cards/EventCard'
import Image from '@Components/Image'
import Section from '@Components/Section'
import { Skeleton } from 'antd'
import TestCard from './Cards/TestCard'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useParams } from 'react-router-dom'

const { Title, Paragraph } = Typography

function StoreScreen () {
 const {
    data: { courses, events, tests },
    isFetching
  } = Learner.Queries.useGetRecommendedProducts()
  const { data: categories } = Learner.Queries.useGetLearnerCategories()
  const { isTablet,isMobile} = useBreakpoint();
  return (
    <Row gutter={[30, 30]}>
      {/* <Col span={24}>
        <HomeCarousel />
      </Col> */}
      {!isMobile?<Col span={24}>
        <Row align={'middle'} gutter={[20,20]}>
          <Col span={12} flex={1}>
            <Title>
              Find your Preferred <br /> Courses and Mock Tests & Improve Your Skills
            </Title>
            <Paragraph>
              Build skills with courses, certificates, and degrees online from{' '}
              <br />
              world-class universities and companies.
            </Paragraph>
            {/* <SearchLearnerCourses /> */}
          </Col>
          <Col span={12}>
          {/* <Calendar fullscreen={false} /> */}
          <Image preview={false} src={BGImage} />
          </Col>
        </Row>
      </Col>:null}
   
      {isFetching ? <Col span={24}>
   
        <Row gutter={[50, 50]}>
        <Col span={24}>
          <Skeleton paragraph={{rows: 1}}	 />
        </Col>
        <Col lg={6} md={8} sm={12} xs={24}>
          <Skeleton active />
        </Col>
        <Col lg={6} md={8} sm={12} xs={24}>
          <Skeleton active />
        </Col>
        <Col lg={6} md={8} sm={12} xs={24}>
          <Skeleton active />
        </Col>
        <Col lg={6} md={8} sm={12} xs={24}>
          <Skeleton active />
        </Col>
        </Row></Col> : <>
        <Divider>
        <Title level={isMobile?2:1}>Expore our products</Title>
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
                    <Row gutter={[30,20]} >
                      {courses.map(course => {
                        return  <Col  
                        sm={12} 
                        md={8} xs={24}
                        lg={6}  >
                          <CourseCard course={course} /></Col>
                      })}
                    </Row>
              </Col>
              </Row>
            </Section>
          </Col>
        )
      })}
      {tests.length ? (
        <Col span={24}>
          <Section
            title={`Mock Tests`}
            // subtitle={category.description}
          >
            <Row>
                  <Col span={24}>
                    <Row gutter={[30,20]} >
                      {tests.map(test => {
                        return  <Col  
                        sm={12} 
                        md={8} xs={24}
                        lg={6}  >
                          <TestCard test={test} /></Col>
                      })}
                    </Row>
              </Col>
            </Row>
          </Section>
        </Col>
        ) : null}</>}
      
{events.length?       <Col span={24}>
          <Section
            title={`Upcoming Events`}
            // subtitle={category.description}
          >
            <Row>
            <Col span={24}>
                    <Row gutter={[30,20]} >
                      {events.map(event => {
                        return  <Col  
                        sm={12} 
                        md={8} xs={24}
                        lg={6}  >
                          <EventCard event={event} /></Col>
                      })}
                    </Row>
              </Col>
            </Row>
          </Section>
        </Col>:null}
  
    </Row>
  )
}

export default StoreScreen
