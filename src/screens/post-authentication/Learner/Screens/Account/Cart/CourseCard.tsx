import { Course, Plan } from '@Types/Courses.types'
import { Instructor } from '@Types/Instructor.types';
import { Button, Card, Col, Form, Image, Input, Row, Space, Tabs, Tag, Typography } from 'antd'
import { INITIAL_COURSE_PLAN_DETAILS } from 'constant.ts';

const { Title, Text } = Typography

interface LearnerCartCourseCardPropsI {
  course: Course;
}

export default function LearnerCartCourseCard(
  props: LearnerCartCourseCardPropsI
) {
  const course = props.course
  const instructor = course.instructor as unknown as Instructor;
    const plan = course.plan as unknown as Plan || INITIAL_COURSE_PLAN_DETAILS;
    
 return (
    <Card bodyStyle={{ padding: 10 }}>
      <Row gutter={[10, 10]}>
        <Col span={8}>
                 <Image src={course.thumbnailImage} />
        </Col>
        <Col span={10}>
          <Space direction='vertical' >
            <Title level={5}>{course.title}</Title>
                     <Text type='secondary' >By {instructor.name}</Text>
                     <Tag color="blue">Best Seller</Tag>

          </Space>
             </Col>
             <Col span={2}>
                 <Button size='small'>Remove</Button>
             </Col>
             <Col span={4}>
                 <Title style={{textAlign:'right'}} level={3}>
                     { plan.price}
                </Title>
             </Col>
      </Row>
    </Card>
  )
}
