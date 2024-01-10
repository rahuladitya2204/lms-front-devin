import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Space,
  Tabs,
  Tag,
  Typography
} from 'antd'
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import { Constants, Learner, Types, Utils } from '@adewaskar/lms-common'

import Image from '@Components/Image'

const { Title, Text } = Typography
const { confirm } = Modal
const { UnitTypeToStr } = Utils

interface LearnerCartCourseItemPropsI {
  course: string;
  discount: Types.ValueUnitType;
  price: Types.ValueUnitType;
  removeItemFromCart: (id: string) => void;
}

export default function LearnerCartCourseItem(
  props: LearnerCartCourseItemPropsI
) {
  const { data: course } = Learner.Queries.useGetCourseDetails(props.course)
  const removeItemFromCart = (id: string) => {
    confirm({
      title: 'Are you sure?',
      // icon: <ExclamationCircleOutlined />,
      content: `You want to remove this item from cart`,
      onOk() {
        props.removeItemFromCart(id)
      },
      okText: 'Remove from cart'
    })
  }

  return (
    <List.Item
      extra={[
        <Text
          strong
          style={{
            fontSize: 16,
            textDecoration: 'line-through',
            color: 'grey'
          }}
        >
          {UnitTypeToStr({
            value: props.price.value + props.discount.value,
            unit: props.price.unit
          })}
        </Text>,
        <Text strong style={{ fontSize: 20 }}>
          {UnitTypeToStr(props.price)}
        </Text>,
        <CloseOutlined
          onClick={() => removeItemFromCart(course._id)}
          style={{ marginLeft: 30 }}
        />
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar shape="square" src={course?.thumbnailImage} />}
        title={<a href="https://ant.design">{course.title}</a>}
        // description={`By ${user.name}`}
      />
    </List.Item>
  )
}
