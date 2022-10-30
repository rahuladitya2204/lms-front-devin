import { ArrowLeftOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space } from 'antd'

import AddChapterScreen from './AddChapterScreen'
import CourseBuilderTree from './CourseBuilderTree'

function CourseBuilderScreen () {
  const onAddNewChapter = () => {}
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

          <Card>
            <CourseBuilderTree />
          </Card>

          <AddChapterScreen onAddNewChapter={onAddNewChapter} />
        </Col>
        <Col span={16}>12</Col>
      </Row>
    </div>
  )
}

export default CourseBuilderScreen
