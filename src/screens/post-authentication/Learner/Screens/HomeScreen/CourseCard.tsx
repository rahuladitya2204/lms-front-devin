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
  Row,
  Space
} from 'antd'
import { NavLink, useNavigate, useParams } from 'react-router-dom'

import { Typography } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { BookOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Course, Plan } from '@Types/Courses.types'
import { INITIAL_COURSE_PLAN_DETAILS } from 'constant.ts'
import styled from '@emotion/styled'

const { Text } = Typography

interface CourseCardPropsI {
  course: Course;
}

const CustomCard = styled(Card)`
cursor: pointer;

`

function CourseCard(props: CourseCardPropsI) {
  const navigate = useNavigate();
  const plan = props.course.plan as unknown as Plan || INITIAL_COURSE_PLAN_DETAILS;
  const discount = 100-(plan.finalPrice.value / plan.listPrice.value) * 100;

  return (
    <Badge.Ribbon text="Best Seller" color="orange">
      <CustomCard
        onClick={() =>
          navigate(
            `/learner/learner/dashboard/courses/${props.course._id}/details`
          )
        } bodyStyle={{padding: 15}}
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
          title={<Space size='small' direction="vertical"  >
            <Text style={{ fontSize: 14 }} type='secondary'>Fashion Photography From Professional</Text>
            <Text strong ellipsis>{props.course.title}</Text>
          </Space>}
          // description={
          //   <Space size='small' direction="horizontal" align='center' style={{display:'flex'}}>
          //     <Rate style={{ fontSize: 12 }} value={4} /> <Text>4.87 (3.8k+ reviews)</Text>
          //   </Space>
          // }
        />
        <Space direction='horizontal' style={{display:'flex',justifyContent:'space-between',marginTop: 10}} align='end' >
          <Space direction='vertical'>
          <Space size='small' direction="horizontal" align='center' style={{display:'flex'}}>
              <Rate disabled style={{ fontSize: 12 }} value={4} /> <Text>4.87 </Text>
            </Space>
            <Space direction='horizontal'>
            <Text type="secondary">
                  <BookOutlined /> {props.course.sections.length} Lessons
            </Text>
            <Text type="secondary">
                  <ClockCircleOutlined /> 8h 12m
                </Text>
        </Space>
          </Space>

            <Space direction='vertical' align='end' size={0}>
              <Text style={{textAlign:'right',textDecoration:'line-through'}} type='secondary'>${plan.listPrice.value}</Text>
              <Text strong style={{fontSize: 20}}>
              ${plan.finalPrice.value}
              </Text>
            </Space>

        </Space>

      </CustomCard>
    </Badge.Ribbon>
  )
}

export default CourseCard
