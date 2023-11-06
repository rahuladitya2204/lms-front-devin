import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import { Constants, Learner, Store, Types, Utils } from '@adewaskar/lms-common'

import { CalendarOutlined } from '@ant-design/icons'
import Countdown from '@Components/Countdown'
import HtmlViewer from '@Components/HtmlViewer'
import Image from '@Components/Image'
import ProductCheckoutButton from '@Components/CheckoutButton'
import dayjs from 'dayjs'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router'

const { Text, Title } = Typography

interface EventDetailScreenPropsI {}

export default function EventDetailScreen(props: EventDetailScreenPropsI) {
  const message = useMessage();
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn);
  const { eventId } = useParams()
  const {
    data: enrolledDetails
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'event',
    id: eventId + ''
  }, {
    enabled:!!isSignedIn
  })
  const isEnrolled = !!enrolledDetails._id
  // console.log(isEnrolled, 'enrolledDetails')
  const { data: event } = Learner.Queries.useGetEventDetails(eventId + '');
  // console.log(event, 'event');
  const plan = event.plan as unknown as Types.Plan;
  // const now = new Date().getTime()
  return (
    <Row>
      <Col span={24}>
        <Row gutter={[30, 30]}>
          <Col span={15}>
            <Row>
              <Col span={24}>
              <HtmlViewer content={event.description} />
              </Col>
              {/* <Col span={24}>
                <HtmlViewer content={event.description} />
              </Col> */}
            </Row>
          </Col>
          <Col span={9}>
          <EventCard eventId={eventId+''} />
          </Col>
        </Row>
      </Col>
      {/* <Col>{event.description}</Col> */}
    </Row>
  )
}



const EventCard = (props: { eventId: string }) => {
  const { eventId}=props
  const message = useMessage()
  const { isSignedIn, user } = Store.useAuthentication(s => s);
  // console.log(user,'user')
  const {
    data: enrolledDetails
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'event',
    id: eventId + ''
  }, {
    enabled:!!isSignedIn
  })
  const isEnrolled = !!enrolledDetails._id
  // console.log(isEnrolled, 'enrolledDetails')
  const { data: event } = Learner.Queries.useGetEventDetails(eventId + '');
  // console.log(event, 'event');
  const plan = event.plan as unknown as Types.Plan || Constants.INITIAL_COURSE_PLAN_DETAILS;
  // console.log(plan,'plans')
  return   <Card                     style={{ margin: '20px 0' }}
  bordered={false}
  bodyStyle={{ padding: 20 }}
title={event.title}>
    <Row gutter={[20, 40]} align="stretch">
      <Col span={24}>
      <Image
        width={'100%'}
        height={200}
        preview={false}
        src={event.thumbnailImage}
      />
      </Col>
    <Col span={24} flex={1}>
      <Row gutter={[20, 10]}>
        <Col span={24}>
          <CalendarOutlined />
          <Text strong style={{ marginLeft: 10 }}>
            {dayjs(event.scheduledAt).format('LLL')}
          </Text>
        </Col>
        <Col span={24}>
          <CalendarOutlined />
          <Text strong style={{ marginLeft: 10 }}>
            Zoom Meeting
          </Text>
        </Col>
        {!event.startedAt ? (
          <Col span={24}>
            <Tag color="blue">
              Starting in{' '}
              <Countdown targetDate={event.scheduledAt} />{' '}
            </Tag>
          </Col>
        ) : (
          <Col span={24}>
            {!event.endedAt ? (
              <Tag color="volcano">Event has started</Tag>
            ) : (
              <Tag color="volcano">Event has ended</Tag>
            )}
          </Col>
        )}
      </Row>
    </Col>
    {isEnrolled ? (
      event.startedAt ? (
        <Col span={24}>
          <Row gutter={[10, 10]}>
            <Col span={24}>
              {!event.endedAt ? (
                <Button type="primary" block>
                  Join Session
                </Button>
              ) : null}
            </Col>
          </Row>
        </Col>
      ) : (
        <Title level={4}>
          You have already enrolled for this session
        </Title>
      )
    ) : (
      <Col span={24}>
        <Row gutter={[10, 10]}>
        <Col span={24}>
<Row justify="space-between" align='middle'>
<Col>
<Row align='middle' gutter={[5, 5]}>
      <Col>
        <Text strong style={{ fontSize: 24 }}>{plan.type === 'free' ? <>
          <Title style={{ marginTop: 0 }} level={3}>Free</Title>
        </> : Utils.UnitTypeToStr(plan.finalPrice)}
        </Text>
      </Col>
      <Col>
        {plan.displayPrice.value?<Text style={{ textDecoration: 'line-through' }} type='secondary'>{Utils.UnitTypeToStr(plan.displayPrice)}</Text>:null}
      </Col>
</Row>
</Col>
{plan.type!=='free' ?<Col>
<Tag color="purple">{ Math.floor(Number(plan.discount))}% off</Tag>
</Col>:null}
</Row>
</Col>
          <Col span={24}>
            <ProductCheckoutButton
              onSuccess={() => {
                message.open({
                  type: 'success',
                  content: `You have enrolled successfully`
                })
              }}
              product={{ type: 'event', id: eventId + '' }}
              block
              type="primary"
            >
              Claim your seat
            </ProductCheckoutButton>
          </Col>
        </Row>
      </Col>
    )}
  </Row>
</Card>
}