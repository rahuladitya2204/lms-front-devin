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
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

const { UnitTypeToStr } = Utils;

interface TestCardPropsI {
  test: Types.Test;
}

const CustomCard = styled(Card)`
cursor: pointer;
/* margin-left: 30px;
margin-bottom: 20px; */
`

function TestCard(props: TestCardPropsI) {
  const { test } = props;
  const navigate = useNavigate();
  const plan = test.plan as unknown as Types.Plan || Constants.INITIAL_COURSE_PLAN_DETAILS;
  // const instructor = test.instructor as unknown as Types.Instructor;
  const formattedDuration = test.duration.enabled? Utils.formatTime(test.duration.value * 60):null
  return (
    // <Badge.Ribbon text="Best Seller" color="orange">
      <CustomCard hoverable
        onClick={() =>
          navigate(
            `../test/${test._id}`
          )
        } bodyStyle={{padding: 15}}
        cover={
          <Image alt="example" style={{height: 140}}
            src={
             test.thumbnailImage
            }
          /> 
        }
      >
        <Card.Meta
          title={<Space size='small' direction="vertical"  >
            {/* {test.analytics.reviews.count ?
              <Space size='small' direction="horizontal" align='center' style={{ display: 'flex' }}>
              <Rate disabled style={{ fontSize: 12 }} value={test.analytics.averageRating} />
              <Text>{test.analytics.averageRating}({formatAvgCount(test.analytics.reviews.count)}) </Text>
            </Space>:null} */}
            <Text style={{fontSize:20}} strong ellipsis>{test.title}</Text>
          </Space>}
        />
          <Row justify={'space-between'} style={{marginTop:10}}>
            {/* <Col>
            <Text style={{fontSize: 13}}>
                  <BookOutlined /> {test.totalItems} Lessons
            </Text>
          </Col> */}
          {/* <Col>
            <Text style={{fontSize: 13}}>
            <BarChartOutlined /> {capitalize(test.difficultyLevel)}
            </Text>
            </Col> */}
            {formattedDuration?<Col>
            <Text style={{fontSize: 13}}>
                  <ClockCircleOutlined /> {formattedDuration}
          </Text>
        </Col>:null}
        </Row>
        <Divider style={{marginTop:10,marginBottom:10}}/>
        <Row justify={'space-between'}>
          {/* <Col>
          <Text ellipsis style={{ fontSize: 14,width: 100 }} type='secondary'>
               {instructor.name}
            </Text>
          </Col> */}
          <Col>
          <Space direction='vertical' align='end' size={0}>
            {plan.type!=='free'?<>
            <Text style={{ textAlign: 'right', textDecoration: 'line-through' }} type='secondary'>
                {UnitTypeToStr(plan.displayPrice)}</Text>
              <Text strong style={{fontSize: 20}}>
              {UnitTypeToStr(plan.finalPrice)}
              </Text></> :
              <Text strong style={{ fontSize: 20 }}>

              Free
            </Text>}
            </Space>
          </Col>
        </Row>
      </CustomCard>
  )
}

export default TestCard
