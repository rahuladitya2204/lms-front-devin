import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import { Learner, Utils } from '@adewaskar/lms-common'

import { CalendarOutlined } from '@ant-design/icons'
import Countdown from '@Components/Countdown'
import Image from '@Components/Image'
import ProductCheckoutButton from '@Components/CheckoutButton'
import dayjs from 'dayjs'
import { useParams } from 'react-router'
import useMessage from '@Hooks/useMessage'

const { Text, Title } = Typography

interface EventDetailScreenPropsI {}

export default function EventDetailScreen(props: EventDetailScreenPropsI) {
  const message = useMessage()
  const { sessionId } = useParams()
  const {
    data: enrolledDetails
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'event',
    id: sessionId + ''
  })
  const isEnrolled = !!enrolledDetails._id
  console.log(isEnrolled, 'enrolledDetails')
  const { data: event } = Learner.Queries.useGetEventDetails(sessionId + '')
  // const now = new Date().getTime()
  return (
    <Row>
      <Col span={24}>
        <Row gutter={[30, 30]}>
          <Col span={15}>
            <Image src={event.image} />
          </Col>
          <Col span={9}>
            <Card style={{ height: '100%' }} title={event.title}>
              <Row gutter={[20, 40]} align="stretch">
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
                        <Space align="end" size={0}>
                          <Text
                            style={{
                              textAlign: 'right',
                              textDecoration: 'line-through'
                            }}
                            type="secondary"
                          >
                            {Utils.UnitTypeToStr(event.price)}
                          </Text>
                          <Text strong style={{ fontSize: 20 }}>
                            {Utils.UnitTypeToStr(event.price)}
                          </Text>
                        </Space>
                      </Col>
                      <Col span={24}>
                        <ProductCheckoutButton
                          onSuccess={() => {
                            message.open({
                              type: 'success',
                              content: `You have enrolled successfully`
                            })
                          }}
                          product={{ type: 'event', id: sessionId + '' }}
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
          </Col>
        </Row>
      </Col>
      <Col>{event.description}</Col>
    </Row>
  )
}
