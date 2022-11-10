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
import MediaPlayer from '@Components/MediaPlayer'
import { UserOutlined } from '@ant-design/icons'
import image from './bg.svg'
import styled from '@emotion/styled'
import { useParams } from 'react-router'
import { INITIAL_COURSE_DETAILS, useGetCourseDetails } from '@Learner/Api/queries'
import { useGetInstructorDetails } from '@User/Api/queries'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PARSE } from '@User/Screens/Courses/CourseBuilder/utils'

const { Title, Text,Paragraph } = Typography

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

const CourseSubTitle = styled(Paragraph)`
  color: #fff !important;
`

function CourseDetailViewer() {
  let [searchParams, setSearchParams] = useSearchParams();
  const { id: courseId } = useParams()
  const [course, setCourse] = useState(INITIAL_COURSE_DETAILS);
  const { data } = useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  })

  useEffect(() => { 
    const courseDataString = PARSE(searchParams.get('details') + '');
    console.log(courseDataString,'courseDataString')
    setCourse(courseDataString)
  }, [])
  
  useEffect(() => { 
    setCourse(data)
  },[data])

  const { data: instructor } = useGetInstructorDetails(course.instructor+'', {
    enabled: !!course.instructor
  })

  return (
    <Container>
      <Row gutter={[20, 20]}>
        <Col span={3} />
        <Col span={12}>
          <Space direction='vertical' size='small' style={{height:190}}>
            <CourseTitle className="course-title" level={2}>
              {course.title}
            </CourseTitle>
            <CourseSubTitle ellipsis className="course-title">
              {course.subtitle}
            </CourseSubTitle>
          </Space>
         
          <Row>
              {instructor?<><Col span={4}>
                <Avatar
                  size={64}
                  src={instructor.image || <UserOutlined />}
                />
              </Col>
              <Col span={6}>
                <MetaText strong>Created By</MetaText> <br />
                <MetaText>{instructor.name}</MetaText>
              </Col></>:null}
              
              <Col span={6}>
                <MetaText strong>Categories</MetaText> <br />
                <MetaText>Design</MetaText>
              </Col>
              <Col span={6}>
                <MetaText strong>Review</MetaText> <br />
                <CustomRate disabled style={{ fontSize: 15 }} value={4} /> <MetaText>
                  {/* 4.87 (3.8k+ reviews) */}
                </MetaText>
              </Col>
            </Row>

          <Row>
            <Col style={{marginTop: 15}} span={24}><CourseDetails  course={course}/></Col>
            </Row>
        </Col>
        <Col span={6}>
          <Card bordered style={{ padding: 0 }} bodyStyle={{ padding: 5 }}>
            <MediaPlayer
              height={150}
              url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
            />
            <Card bordered={false} bodyStyle={{padding: 15}}>
            <Space style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
                  <Title level={4}>$89.9</Title>
                  <Tag color="purple">91% off</Tag>
                  </Space>
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
