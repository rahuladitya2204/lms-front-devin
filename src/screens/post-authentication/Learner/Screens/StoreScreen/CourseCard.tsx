import {
  Badge,
  Card,
  Rate,
  Space
} from 'antd'
import { BookOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Constants, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import { Typography } from 'antd'
import { Utils } from '@adewaskar/lms-common'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

const { UnitTypeToStr } = Utils;

interface CourseCardPropsI {
  course: Types.Course;
}

const CustomCard = styled(Card)`
cursor: pointer;
`

function CourseCard(props: CourseCardPropsI) {
  const navigate = useNavigate();
  const plan = props.course.plan as unknown as Types.Plan || Constants.INITIAL_COURSE_PLAN_DETAILS;
  const instructor = props.course.instructor as unknown as Types.Instructor;
  return (
    <Badge.Ribbon text="Best Seller" color="orange">
      <CustomCard hoverable
        onClick={() =>
          navigate(
            `../courses/${props.course._id}`
          )
        } bodyStyle={{padding: 15}}
        cover={
          <Image alt="example" style={{height: 140}}
            src={
             props.course.thumbnailImage
            }
          /> 
        }
      >
        <Card.Meta
          // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
          title={<Space size='small' direction="vertical"  >
            <Text style={{ fontSize: 14 }} type='secondary'>
              By {instructor.name}
            </Text>
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
            <Text style={{fontSize: 13}} type="secondary">
                  <BookOutlined /> {props.course.sections.length} Lessons
            </Text>
            <Text style={{fontSize: 13}} type="secondary">
                  <ClockCircleOutlined /> 8h 12m
                </Text>
        </Space>
          </Space>

            <Space direction='vertical' align='end' size={0}>
              <Text style={{textAlign:'right',textDecoration:'line-through'}} type='secondary'>{UnitTypeToStr(plan.displayPrice)}</Text>
              <Text strong style={{fontSize: 20}}>
              {UnitTypeToStr(plan.finalPrice)}
              </Text>
            </Space>

        </Space>

      </CustomCard>
    </Badge.Ribbon>
  )
}

export default CourseCard
