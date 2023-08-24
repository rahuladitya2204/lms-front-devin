import { Alert, Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import { Enum, Learner, Utils } from '@adewaskar/lms-common'
import { useNavigate, useParams } from 'react-router'

import { CalendarOutlined } from '@ant-design/icons'
import Countdown from '@Components/Countdown'
import HtmlViewer from '@Components/HtmlViewer'
import Image from '@Components/Image'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import ProductCheckoutButton from '@Components/CheckoutButton'
import TestMetadata from './TestMetadata'
import dayjs from 'dayjs'
import { useMemo } from 'react'

const { Text, Paragraph } = Typography

interface TestDetailScreenPropsI {}

export default function TestDetailScreen(
  props: TestDetailScreenPropsI
) {
  const navigate = useNavigate();
  const { testId } = useParams()
  const {
    data: enrolledDetails
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'test',
    id: testId + ''
  },
    {
    // @ts-ignore
    refetchInterval: 2000
  })
  const isEnrolled = !!enrolledDetails._id
  const { data: test } = Learner.Queries.useGetTestDetails(testId + '', {
    // @ts-ignore
    refetchInterval: 2000
  });
  console.log(test.status, 'test.status');
  const ENROLLED_CTA = useMemo(() => { 
    if (test.isLive) {
      switch (test.status) {

        case Enum.TestStatus.PUBLISHED: {
          return  <Alert
          style={{ marginBottom: 20 }}
          message="You're enrolled for this test"
          type="success"
          showIcon
        />
          break;
        }
          
        case Enum.TestStatus.IN_PROGRESS: {
          return <Button onClick={()=>navigate('start')} block type='primary'>
            Join Test
          </Button>
          break;
        }
          
        case Enum.TestStatus.ENDED: {
          return <Alert
          style={{ marginBottom: 20 }}
          message="The test has ended"
          type='error'
          showIcon
        />
          break;
        }
      }
    }
    else {
      console.log(enrolledDetails,'enrolledDetails')
      if (!enrolledDetails.metadata.test.startedAt) {
        return <Button onClick={()=>navigate('start')} block type='primary'>
        Start Test
      </Button>
      }
      if(enrolledDetails.metadata.test.endedAt) {
        return  <Alert
        style={{ marginBottom: 20 }}
        message="You have attended this test."
        type="success"
        showIcon action={<Button>View Result</Button>}
      />
      }
     
    }
 
  },[test])

  return (
    <Row>
      <Col span={24}>
        <Row gutter={[30, 30]}>
          <Col span={15}>
            <Row>
              {test.landingPage.promoVideo ? (
                <Col span={24}>
                  <Card
                    style={{ margin: '20px 0' }}
                    bordered={false}
                    bodyStyle={{ padding: 0 }}
                  >
                    <MediaPlayer
                      height={400}
                      fileId={test.landingPage.promoVideo}
                    />
                  </Card>
                </Col>
              ) : null}
              <Col span={24}>
                <Paragraph style={{ fontSize: 16 }}>
                  <HtmlViewer content={test.landingPage.description} />
                </Paragraph>
              </Col>
            </Row>
          </Col>
          <Col span={9}>
            <Card
              bodyStyle={{ padding: 10, paddingBottom: 20 }}
              // style={{ height: '100%' }}
              title={test.title}
            >
              <Row gutter={[20, 40]} align="stretch">
                <Col span={24}>
                  <Image
                    width={'100%'}
                    height={200}
                    preview={false}
                    src={test.image}
                  />
                </Col>
                <Col span={24} flex={1}>
                  <Col span={24}>
                    <Row gutter={[10, 10]}>
                      <Col span={24}>
                        <TestMetadata test={test} />
                      </Col>
                      <Col span={24}>
                        {
                          isEnrolled ?
                            <>
                              {
                                ENROLLED_CTA
                              }
                            </> :
                            <ProductCheckoutButton
                          product={{ type: 'test', id: testId + '' }}
                          block
                          type="primary"
                        >
                          Claim your seat
                        </ProductCheckoutButton>
                        }
                      </Col>
                    </Row>
                  </Col>
                </Col>
                {/* {isEnrolled ? (
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
                        <TestMetadata test={test} />
                      </Col>
                      <Col span={24}>
                        <ProductCheckoutButton
                          product={{ type: 'test', id: testId + '' }}
                          block
                          type="primary"
                        >
                          Claim your seat
                        </ProductCheckoutButton>
                      </Col>
                    </Row>
                  </Col>
                )} */}
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col>{test.description}</Col>
    </Row>
  )
}
