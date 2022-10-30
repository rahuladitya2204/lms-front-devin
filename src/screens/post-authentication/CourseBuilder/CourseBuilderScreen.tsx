import { ArrowLeftOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row } from 'antd'

import AddChapterScreen from './AddChapter'
import { useGetCourses } from '../../../queries/Courses/CoursesHooks'
import { useParams } from 'react-router'

function CourseBuilderScreen () {
  const { data: courses } = useGetCourses()
  const params = useParams();
  return (
    <div className="site-card-wrapper">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Button icon={<ArrowLeftOutlined />} size="large" type="link">
            Back to courses
          </Button>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[<EyeOutlined />, <EditOutlined />]}
          />
          <AddChapterScreen />
        </Col>
        <Col span={16}>12</Col>
      </Row>
    </div>
  )
}

export default CourseBuilderScreen
