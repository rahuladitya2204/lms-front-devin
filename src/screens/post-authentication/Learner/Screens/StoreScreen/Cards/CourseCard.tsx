import {
  Badge,
  Card,
  Col,
  Divider,
  Rate,
  Row,
  Space
} from 'antd'
import { BarChartOutlined, BookOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Constants, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import { Typography } from 'antd'
import { Utils } from '@adewaskar/lms-common'
import { capitalize } from 'lodash'
import { formatAvgCount } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

const { UnitTypeToStr } = Utils;

interface CourseCardPropsI {
  course: Types.Course;
}

const CustomCard = styled(Card)`
cursor: pointer;
/* margin-bottom: 20px;
margin-left: 30px; */
`

function CourseCard(props: CourseCardPropsI) {
  const { course } = props;
  const navigate = useNavigate();
  const plan = course.plan as unknown as Types.Plan || Constants.INITIAL_COURSE_PLAN_DETAILS;
  const instructor = course.instructor as unknown as Types.Instructor;
  const formattedDuration = Utils.formatTime(course.totalDuration)
  return (
    // <Badge.Ribbon text="Best Seller" color="orange">
      <CustomCard hoverable
        onClick={() =>
          navigate(
            `../courses/${course._id}`
          )
        } bodyStyle={{padding: 15}}
        cover={
          <Image alt="example" style={{height: 140}}
            src={
             course.thumbnailImage
            }
          /> 
        }
      >
        <Card.Meta
          title={<Space size='small' direction="vertical"  >
           {course.analytics.reviews.count? <Space size='small' direction="horizontal" align='center' style={{display:'flex'}}>
              <Rate disabled style={{ fontSize: 12 }} value={course.analytics.averageRating} /> <Text>{course.analytics.averageRating}({formatAvgCount(course.analytics.reviews.count) }) </Text>
            </Space>:null}
            <Text style={{
          fontSize: 13,
          whiteSpace: 'normal', // Ensures text wraps
          overflowWrap: 'break-word' // Breaks words to prevent overflow
        }}>{course.title}</Text>
          </Space>}
        />
          <Row justify={'space-between'} style={{marginTop:10}}>
            <Col>
            <Text style={{fontSize: 13}}>
                  <BookOutlined /> {course.totalItems} Lessons
            </Text>
          </Col>
            <Col>
            <Text style={{fontSize: 13}}>
                  <ClockCircleOutlined /> {formattedDuration}
                </Text></Col>
        </Row>
        <Divider style={{marginTop:10,marginBottom:10}}/>
        <Row justify={'space-between'}>
            <Col>
            <Text ellipsis style={{ fontSize: 14,width: 100 }} type='secondary'>
               {instructor.name}
            </Text>
    </Col>
            <Col>
            <Text style={{ textAlign: 'right', textDecoration: 'line-through' }} type='secondary'>
                {UnitTypeToStr(plan.displayPrice)}</Text> < br/>
            <Text strong style={{fontSize: 20}}>
              {UnitTypeToStr(plan.finalPrice)}
              </Text>
            </Col>
          </Row>
      </CustomCard>
    // </Badge.Ribbon>
  )
}

export default CourseCard
