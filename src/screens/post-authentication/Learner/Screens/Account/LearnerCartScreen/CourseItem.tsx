import { Avatar, Button, Card, Col, Form, Input, List, Modal, Row, Space, Tabs, Tag, Typography } from 'antd'
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import { Constants, Types, Utils } from '@adewaskar/lms-common'

import Image from '@Components/Image'

const { Title, Text } = Typography
const { confirm } = Modal;
const { UnitTypeToStr } = Utils;

interface LearnerCartCourseItemPropsI {
  course: Types.Course;
  discount: Types.ValueUnitType;
  price: Types.ValueUnitType;
  removeItemFromCart: (id: string) => void;
}

export default function LearnerCartCourseItem(
  props: LearnerCartCourseItemPropsI
) {
  const course = props.course
  const removeItemFromCart = (id:string) => {
    confirm({
      title:'Are you sure?',
      // icon: <ExclamationCircleOutlined />,
      content: `You want to remove this item from cart`,
      onOk() {
        props.removeItemFromCart(id);
      },
      okText:'Remove from cart'
    });
    }

    const instructor = course.instructor as unknown as Types.Instructor;
    const plan = course.plan as unknown as Types.Plan || Constants.INITIAL_COURSE_PLAN_DETAILS;

    return (
      <List.Item extra={[<Text strong style={{fontSize:20}}>{UnitTypeToStr(props.price)}</Text>,<CloseOutlined onClick={()=>removeItemFromCart(course._id)} style={{marginLeft: 30}}/>]}>
      <List.Item.Meta
        avatar={
          <Avatar shape='square'
            src={course.thumbnailImage}
          />
        }
        title={<a href="https://ant.design">{course.title}</a>}
        // description={`By ${instructor.name}`}
      />
    </List.Item>
  )
}
