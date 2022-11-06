import {
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
import MediaPlayer from '../../../../components/MediaPlayer'
import { UserOutlined } from '@ant-design/icons'
import image from './bg.svg'
import styled from '@emotion/styled'
import { useGetCourseDetails } from '../../../../queries/Courses/queries'
import { useGetInstructorDetails } from '../../../../queries/Instructor/queries'
import { useParams } from 'react-router'

const { Title, Text } = Typography

const Container = styled.div`
  background-image: url(${image});
  background-size: contain;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  padding-top: 20px;
`

const CustomRate = styled(Rate)`
  .ant-rate-star {
    margin-right: 5px;
  }
`

const MetaText = styled(Text)`
  color: #fff !important;
`

const CourseTitle = styled(Title)`
  color: #fff !important;
`

const CourseSubTitle = styled(Text)`
  color: #fff !important;
`

function CourseDetailViewer() {
  const { id: courseId } = useParams()
  const { data: course } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })

  const { data: instructor } = useGetInstructorDetails(course.instructor+'', {
    enabled: !!course.instructor
  })

  console.log(course, 'courseDetails')

  return (
    <Container>
      <Row gutter={[20, 20]}>
        <Col span={3} />
        <Col span={12}>
          <Space
            style={{ height: 270, overflow: 'hidden' }}
            size="middle"
            direction="vertical"
          >
            <CourseTitle className="course-title" level={2}>
              {course.title}
            </CourseTitle>
            <CourseSubTitle className="course-title">
              {course.subtitle}
            </CourseSubTitle>
            <Row>
              {instructor?<><Col span={4}>
                <Avatar
                  size={64}
                  src={instructor.image || <UserOutlined />}
                />
              </Col>
              <Col span={4}>
                <MetaText strong>Created By</MetaText> <br />
                <MetaText>{instructor.name}</MetaText>
              </Col></>:null}
              
              <Col span={4}>
                <MetaText strong>Categories</MetaText> <br />
                <MetaText>Design</MetaText>
              </Col>
              <Col span={4}>
                <MetaText strong>Review</MetaText> <br />
                <CustomRate disabled style={{ fontSize: 15 }} value={4} /> <MetaText>
                  {/* 4.87 (3.8k+ reviews) */}
                </MetaText>
              </Col>
            </Row>
          </Space>
            <CourseDetails  course={course}/>
        </Col>
        <Col span={6}>
          <Card bordered style={{ padding: 0 }} bodyStyle={{ padding: 5 }}>
            <MediaPlayer
              height="150px"
              url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
            />
            <Card bordered={false} bodyStyle={{padding: 15}}>
            <Row gutter={[15, 15]}>
              <Col span={24}>
                <Row gutter={[20, 20]}>
                  <Col span={12}>
                    <Title level={4}>$89.9</Title>
                  </Col>
                  <Col span={12}>
                    <Tag color="purple">91% off</Tag>
                  </Col>{' '}
                </Row>
              </Col>
            </Row>
            <Row gutter={[10, 10]}>
              <Col span={24}>
                <Button size='large' type="primary" block>
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
           </Card>
          </Card>
        </Col>
        <Col span={3} />
      </Row>
    </Container>
  )
}

export default CourseDetailViewer
