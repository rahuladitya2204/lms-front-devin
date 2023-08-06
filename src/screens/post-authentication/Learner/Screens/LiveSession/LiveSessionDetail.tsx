import ProductCheckoutButton from '@Components/CheckoutButton'
import Countdown from '@Components/Countdown'
import Image from '@Components/Image'
import { Learner, Utils } from '@adewaskar/lms-common'
import { CalendarOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useParams } from 'react-router'

const { Text, Title } = Typography

interface LiveSessionDetailScreenPropsI {}

export default function LiveSessionDetailScreen(
  props: LiveSessionDetailScreenPropsI
) {
  const { sessionId } = useParams()
  const {
    data: enrolledDetails
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'live-session',
    id: sessionId + ''
  })
  const isEnrolled = !!enrolledDetails._id
  console.log(isEnrolled, 'enrolledDetails')
  const { data: liveSession } = Learner.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )
  // const now = new Date().getTime()
  return (
    <Row>
      <Col span={24}>
        <Row gutter={[30, 30]}>
          <Col span={15}>
            <Image src={liveSession.image} />
          </Col>
          <Col span={9}>
            <Card style={{ height: '100%' }} title={liveSession.title}>
              <Row gutter={[20, 40]} align='stretch'>
                <Col span={24} flex={1}>
                  <Row gutter={[20, 10]}>
                    <Col span={24}>
                      <CalendarOutlined />
                      <Text strong style={{ marginLeft: 10 }}>
                        {dayjs(liveSession.scheduledAt).format('LLL')}
                      </Text>
                    </Col>
                    <Col span={24}>
                      <CalendarOutlined />
                      <Text strong style={{ marginLeft: 10 }}>
                        Zoom Meeting
                      </Text>
                    </Col>
                    {!liveSession.startedAt ? (
                      <Col span={24}>
                        <Tag color="blue">
                          Starting in{' '}
                          <Countdown
                            targetDate={dayjs(liveSession.scheduledAt).toDate()}
                          />{' '}
                        </Tag>
                      </Col>
                    ) : (
                      <Col span={24}>
                        {!liveSession.endedAt ? (
                          <Tag color="volcano">Session has started</Tag>
                        ) : (
                          <Tag color="volcano">Session has ended</Tag>
                        )}
                      </Col>
                    )}
                  </Row>
                </Col>
                {isEnrolled ? (
                  <Col span={24}>
                    <Row gutter={[10, 10]}>
                      <Col span={24}>
                        <Button type="primary" block>
                          Join Session
                        </Button>
                      </Col>
                    </Row>
                  </Col>
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
                            {Utils.UnitTypeToStr(liveSession.price)}
                          </Text>
                          <Text strong style={{ fontSize: 20 }}>
                            {Utils.UnitTypeToStr(liveSession.price)}
                          </Text>
                        </Space>
                      </Col>
                      <Col span={24}>
                        <ProductCheckoutButton
                          product={{ type: 'live-session', id: sessionId + '' }}
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
      <Col>{liveSession.description}</Col>
    </Row>
  )
}
