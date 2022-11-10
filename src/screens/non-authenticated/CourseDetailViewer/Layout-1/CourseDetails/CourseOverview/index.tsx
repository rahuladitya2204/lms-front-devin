import { Col, List, Row, Typography } from 'antd'

import { CheckCircleTwoTone } from '@ant-design/icons'
import { Course } from '@Types/Courses.types'
import CourseDetailList from './CourseDetailList'
import { Fragment } from 'react'

const { Title, Paragraph } = Typography

interface CourseOverviewPropsI {
  course: Course;
}

function CourseOverview(props: CourseOverviewPropsI) {
  return (
    <Fragment>
      <Row gutter={[30, 30]}>
        <Col span={24}>
          <Title level={4}>Course Description</Title>
          <Paragraph
            ellipsis={{
              rows: 2,
              expandable: true,
              symbol: 'readmore'
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: props.course.description }} />
          </Paragraph>
        </Col>

        <Col span={24}>
          <Title level={4}>What You'll Learn</Title>
          <CourseDetailList
            data={props.course.whatYouLearn}
            renderItem={item => (
              <List.Item>
                <CheckCircleTwoTone
                  style={{ marginRight: 10 }}
                  // twoToneColor="#52c41a"
                />
                {item}
              </List.Item>
            )}
          />
        </Col>

        <Col span={24}>
          <Title level={4}>Course Requirements</Title>
          <CourseDetailList
            data={props.course.requirements}
            renderItem={item => (
              <List.Item>
                <CheckCircleTwoTone style={{ marginRight: 10 }} />
                {item}
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </Fragment>
  )
}

export default CourseOverview
