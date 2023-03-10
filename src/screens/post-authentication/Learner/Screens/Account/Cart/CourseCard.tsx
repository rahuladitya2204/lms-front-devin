import { Button, Card, Col, Form, Input, Modal, Row, Space, Tabs, Tag, Typography } from 'antd'

import { DeleteOutlined } from '@ant-design/icons';
import { INITIAL_COURSE_PLAN_DETAILS } from 'constant.ts';
import Image from '@Components/Image'
import { Types } from '@adewaskar/lms-common'
import { UnitTypeToStr } from '@User/Screens/Courses/CourseBuilder/utils';

const { Title, Text } = Typography
const {confirm } = Modal;
interface LearnerCartCourseCardPropsI {
  course: Types.Course;
  removeItemFromCart: (id: string) => void;
}

export default function LearnerCartCourseCard(
  props: LearnerCartCourseCardPropsI
) {
  const course = props.course
  const instructor = course.instructor as unknown as Types.Instructor;
    const plan = course.plan as unknown as Types.Plan || INITIAL_COURSE_PLAN_DETAILS;
  const removeItemFromCart = (id:string) => {
    confirm({
      title:'Are you sure?',
      // icon: <ExclamationCircleOutlined />,
      content: `You want to remvoe this item from cart`,
      onOk() {
        props.removeItemFromCart(id);
      },
      okText:'Remove from cart'
    });
    }
 return (
    <Card bodyStyle={{ padding: 10 }}>
      <Row gutter={[10, 10]} justify='center'>
        <Col span={8}>
                 <Image src={course.thumbnailImage} />
        </Col>
        <Col span={11}>
          <Space direction='vertical' >
            <Title level={5}>{course.title}</Title>
                     <Text type='secondary' >By {instructor.name}</Text>
                     <Tag color="blue">Best Seller</Tag>

          </Space>
             </Col>
             <Col span={1}>
                 <Button onClick={()=>removeItemFromCart(course._id)} shape='circle' icon={<DeleteOutlined/>} size='small'></Button>
             </Col>
             <Col span={4}>
                 <Title style={{textAlign:'right'}} level={3}>
                     {UnitTypeToStr(plan.finalPrice)}
                </Title>
             </Col>
      </Row>
    </Card>
  )
}
