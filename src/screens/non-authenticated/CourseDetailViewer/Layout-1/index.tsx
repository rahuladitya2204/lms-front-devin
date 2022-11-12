import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Rate,
  Row,
  Space,
  Tag,
  Typography
} from 'antd'

import CourseDetails from './CourseDetails'
import CourseMetadata from './CourseMetadata'
import MediaPlayer from '@Components/MediaPlayer'
import {
  AlertOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons'
import image from './bg.svg'
import styled from '@emotion/styled'
import { useParams } from 'react-router'
import {
  INITIAL_COURSE_DETAILS,
  useGetCourseDetails
} from '@Learner/Api/queries'
import { useGetInstructorDetails } from '@User/Api/queries'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PARSE } from '@User/Screens/Courses/CourseBuilder/utils'
import { Instructor } from '@Types/Instructor.types'

const { Title, Text, Paragraph } = Typography

const Container = styled.div`
  /* background-image: url(${image}); */
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  /* height: 100vh; */
  padding-top: 20px;
`

const CustomRate = styled(Rate)`
  .ant-rate-star {
    margin-right: 5px;
  }
`

const MetaText = styled(Text)`
  /* color: #fff !important; */
`

const CourseTitle = styled(Title)`
  /* color: #fff !important; */
`

const CourseSubTitle = styled(Paragraph)`
  /* color: #fff !important; */
  font-size: 20px;
`

function CourseDetailViewer () {
  const { id: courseId } = useParams()
  const [course, setCourse] = useState(INITIAL_COURSE_DETAILS)
  const { data } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })

  useEffect(
    () => {
      setCourse(data)
    },
    [data]
  )

  const instructor = course.instructor as unknown as Instructor;

  return (
    <Container>
      <Row gutter={[20, 20]} justify="space-between">
        <Col span={3} />
        <Col span={12}>
          <Row justify="space-between" align="top" gutter={[20, 20]}>
            <Col span={24}>
              <Row gutter={[30, 30]}>
                <Col span={24}>
                  <CourseTitle className="course-title" level={3}>
                    {course.title}
                  </CourseTitle>
                  <Col span={24} />
                  <CourseSubTitle className="course-title">
                    {course.subtitle}
                  </CourseSubTitle>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Row justify="start" align="middle">
                    <Col>
                      <Avatar
                        size={64}
                        src={instructor.image || <UserOutlined color="black" />}
                      />
                    </Col>
                    <Col>
                      <MetaText strong>Created By</MetaText> <br />
                      <MetaText>{instructor.name}</MetaText>
                    </Col>
                  </Row>
                </Col>

                <Col>
                  <MetaText strong>Categories</MetaText> <br />
                  <MetaText>Design</MetaText>
                </Col>
                <Col>
                  <MetaText strong>Review</MetaText> <br />
                  <CustomRate
                    disabled
                    style={{ fontSize: 15 }}
                    value={4}
                  />{' '}
                  4.87 (3.8k+ reviews)
                  <MetaText />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col style={{ marginTop: 15 }} span={24}>
              <CourseDetails course={course} />
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Card
            cover
            bordered
            style={{ padding: 0 }}
            bodyStyle={{ padding: 5 }}
          >
            <Card bordered={false} bodyStyle={{ padding: 15 }}>
              <Row gutter={[20, 10]}>
                <Col span={24}>
                  <Row justify="space-between" align='middle'>
                    <Col>
                      <Title level={4}>$89.9</Title>
                    </Col>
                    <Col>
                      <Tag color="purple">91% off</Tag>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Alert
                    icon={<AlertOutlined />}
                    message="Only 2 days at this price"
                    type="error"
                    showIcon
                  />
                </Col>
                <Col span={24}>
                  <Row gutter={[15, 15]}>
                    <Col span={24}>
                      <Button size="large" type="primary" block>
                        Buy Now
                      </Button>
                    </Col>
                    <Col span={24}>
                      <Button size="large" type="ghost" block>
                        Enroll Now
                      </Button>
                    </Col>{' '}
                    <Col span={24}>
                      <CourseMetadata course={course} />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          </Card>
        </Col>
        <Col span={3} />
      </Row>
    </Container>
  )
}

export default CourseDetailViewer
