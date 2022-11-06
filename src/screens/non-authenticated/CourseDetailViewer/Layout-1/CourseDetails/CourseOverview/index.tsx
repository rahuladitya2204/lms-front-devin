import { Button, Col, List, Row, Typography } from 'antd'

import { CheckCircleTwoTone } from '@ant-design/icons'
import CourseDetailList from './CourseDetailList'
import { CourseDetailsType } from '../../../../../../types/Courses.types'
import { Fragment } from 'react'
import styled from '@emotion/styled'

const { Title, Text, Paragraph } = Typography

const ListItem = styled(List.Item)`
  padding: 5px 15px;
`
interface CourseOverviewPropsI {
  course: CourseDetailsType;
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
            Do you want to become a UI/UX designer but you don't know where to
            start? This course will allow you to develop your user interface
            design skills and you can add UI designer to your CV and start
            getting clients for your skills. Hi everyone. I'm Arash and I'm a
            UI/UX designer. In this course, I will help you learn and master
            Figma app comprehensively from scratch. Figma is an innovative and
            brilliant tool for User Interface design. It's used by everyone from
            entrepreneurs and start-ups to Apple, Airbnb, Facebook, etc.
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
                <CheckCircleTwoTone
                  style={{ marginRight: 10 }}
                  // twoToneColor="#52c41a"
                />
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
