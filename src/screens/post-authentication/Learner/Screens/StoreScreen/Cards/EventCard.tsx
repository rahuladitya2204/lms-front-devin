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
  
  interface EventCardPropsI {
    event: Types.Event;
  }
  
  const CustomCard = styled(Card)`
  cursor: pointer;
  margin-left: 30px;
  margin-bottom: 20px;
  `
  
  function EventCard(props: EventCardPropsI) {
    const { event } = props;
    const navigate = useNavigate();
    const plan = event.plan as unknown as Types.Plan || Constants.INITIAL_COURSE_PLAN_DETAILS;
    // const instructor = event.instructor as unknown as Types.Instructor;
      const formattedDuration = Utils.formatTime(event.duration * 60);
    return (
      // <Badge.Ribbon text="Best Seller" color="orange">
        <CustomCard hoverable
          onClick={() =>
            navigate(
              `../event/${event._id}`
            )
          } bodyStyle={{padding: 15}}
          cover={
            <Image alt="example" style={{height: 140}}
              src={
               event.thumbnailImage
              }
            /> 
          }
        >
          <Card.Meta
            title={<Space size='small' direction="vertical"  >
              {/* {event.analytics.reviews.count ?
                <Space size='small' direction="horizontal" align='center' style={{ display: 'flex' }}>
                <Rate disabled style={{ fontSize: 12 }} value={event.analytics.averageRating} />
                <Text>{event.analytics.averageRating}({formatAvgCount(event.analytics.reviews.count)}) </Text>
              </Space>:null} */}
              <Text style={{fontSize:20}} strong ellipsis>{event.title}</Text>
            </Space>}
          />
            <Row justify={'space-between'} style={{marginTop:10}}>
              {/* <Col>
              <Text style={{fontSize: 13}}>
                    <BookOutlined /> {event.totalItems} Lessons
              </Text>
            </Col> */}
            {/* <Col>
              <Text style={{fontSize: 13}}>
              <BarChartOutlined /> {capitalize(event.difficultyLevel)}
              </Text>
              </Col> */}
              <Col>
              <Text style={{fontSize: 13}}>
                    <ClockCircleOutlined /> {formattedDuration}
                  </Text></Col>
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
  
  export default EventCard
  