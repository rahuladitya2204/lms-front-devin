import ProductCheckoutButton from '@Components/CheckoutButton'
import Countdown from '@Components/Countdown'
import Image from '@Components/Image'
import { Learner, Utils } from '@adewaskar/lms-common'
import { CalendarOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useParams } from 'react-router'

const { Text, Title } = Typography

interface LiveTestDetailScreenPropsI {}

export default function LiveTestDetailScreen(
  props: LiveTestDetailScreenPropsI
) {
  const { testId } = useParams()
  const {
    data: enrolledDetails
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'live-session',
    id: testId + ''
  })
  const isEnrolled = !!enrolledDetails._id
  console.log(isEnrolled, 'enrolledDetails')
  const { data: liveTest } = Learner.Queries.useGetLiveTestDetails(testId + '')
  // const now = new Date().getTime()
  return (
    <Row>
      <Col span={24}>
        <Row gutter={[30, 30]}>
          <Col span={15}>
            <Image src={liveTest.image} />
          </Col>
          <Col span={9}>
            <Card style={{ height: '100%' }} title={liveTest.title}>
              <Row gutter={[20, 40]} align="stretch">
                <Col span={24} flex={1}>
                  <Row gutter={[20, 10]}>
                    <Col span={24}>
                      <CalendarOutlined />
                      <Text strong style={{ marginLeft: 10 }}>
                        {dayjs(liveTest.scheduledAt).format('LLL')}
                      </Text>
                    </Col>
                    <Col span={24}>
                      <CalendarOutlined />
                      <Text strong style={{ marginLeft: 10 }}>
                        Zoom Meeting
                      </Text>
                    </Col>
                    {!liveTest.startedAt ? (
                      <Col span={24}>
                        <Tag color="blue">
                          Starting in{' '}
                          <Countdown
                            targetDate={liveTest.scheduledAt}
                          />{' '}
                        </Tag>
                      </Col>
                    ) : (
                      <Col span={24}>
                        {!liveTest.endedAt ? (
                          <Tag color="volcano">Test has started</Tag>
                        ) : (
                          <Tag color="volcano">Test has ended</Tag>
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
                          Join Test
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
                            {Utils.UnitTypeToStr(liveTest.price)}
                          </Text>
                          <Text strong style={{ fontSize: 20 }}>
                            {Utils.UnitTypeToStr(liveTest.price)}
                          </Text>
                        </Space>
                      </Col>
                      <Col span={24}>
                        <ProductCheckoutButton
                          product={{ type: 'live-test', id: testId + '' }}
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
      <Col>{liveTest.description}</Col>
    </Row>
  )
}
