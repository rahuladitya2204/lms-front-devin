import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Rate,
  Badge,
  Row
} from 'antd'
import { NavLink, useNavigate, useParams } from 'react-router-dom'

import { Typography } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { BookOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Course, Plan } from '@Types/Courses.types'

const { Text } = Typography

interface CourseCardPropsI {
  course: Course;
}

function CourseCard(props: CourseCardPropsI) {
  const navigate = useNavigate();
  const plan = props.course.plan as unknown as Plan;
  return (
    <Badge.Ribbon text="Best Seller" color="orange">
      <Card
        onClick={() =>
          navigate(
            `/learner/learner/dashboard/courses/${props.course._id}/details`
          )
        }
        cover={
          <img
            alt="example"
            src={
              props.course.thumbnailImage ||
              'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
            }
          />
        }
      >
        <Meta
          // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
          title={<Text>Fashion Photography From Professional</Text>}
          description={
            <Row justify="space-between" align="middle">
              <Col>
                <Rate style={{ fontSize: 12 }} value={4} />
              </Col>{' '}
              <Col>4.87(3.8K+ Reviews)</Col>
            </Row>
          }
        />
        <Row style={{ marginTop: 5 }} justify="space-between">
          <Col span={12}>
            <Row>
              {' '}
              <Col span={24}>
                <Text type="secondary">
                  <BookOutlined /> 5 lessons
                </Text>
              </Col>
              <Col span={24}>
                <Text type="secondary">
                  <ClockCircleOutlined /> 8h 12m
                </Text>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
          <Row>
                  <Col span={24}>
                    {' '}
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 20,
                        textAlign: 'right',
                        textDecoration: 'line-through'
                      }}
                    >
                      $ {plan.listPrice.value}
                    </Text>
                  </Col>
                </Row>
            <Row>
              <Col span={24}>
                {' '}
                <Text strong style={{ fontSize: 30, textAlign: 'right' }}>
                $ {plan.finalPrice.value}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </Badge.Ribbon>
  )
}

export default CourseCard
