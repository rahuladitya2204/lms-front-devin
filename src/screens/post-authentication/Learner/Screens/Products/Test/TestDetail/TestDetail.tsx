import { Alert, Button, Card, Col, Row, Skeleton, Space, Tag, Typography, message } from 'antd'
import { CalendarOutlined, InfoOutlined } from '@ant-design/icons'
import { Constants, Enum, Learner, Store, Types, Utils } from '@adewaskar/lms-common'
import { Fragment, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'

import ActionDrawer from '@Components/ActionDrawer'
import ActionModal from '@Components/ActionModal'
import CompletedLiveTestCard from './CompleteLiveTestMetadata'
import CompletedTestCard from './CompletedTestMetadata'
import Countdown from '@Components/Countdown'
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import Image from '@Components/Image'
import LearnerLogin from '@Learner/Screens/Login'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import ProductCheckoutButton from '@Components/CheckoutButton'
import SkeletonImage from '@Components/SkeletonImage'
import TestMetadata from './TestMetadata'
import TestTimeCountdown from '@Components/TestTimeCountdown'
import Title from 'antd/es/typography/Title'
import dayjs from 'dayjs'
import useBreakpoint from '@Hooks/useBreakpoint'
import useMessage from '@Hooks/useMessage'
import { useQueryClient } from '@tanstack/react-query'

const { Text, Paragraph } = Typography
const { UnitTypeToStr } = Utils;

interface TestDetailScreenPropsI {}

export default function TestDetailScreen(
  props: TestDetailScreenPropsI
) {
  const { testId } = useParams();

  const {
    data: enrolledDetails,
    isLoading: loadingEnrolledTest
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'test',
    id: testId + ''
  })
  const { data: test,isLoading: loadingTest } = Learner.Queries.useGetTestDetails(testId + '');
  const plan = test.plan as unknown as Types.Plan || Constants.INITIAL_COURSE_PLAN_DETAILS;
  const testEndDate = enrolledDetails.metadata.test.endedAt || test.live.endedAt;
  const Metadata = testEndDate ? <>
  {loadingEnrolledTest?<Skeleton paragraph={{rows:8}} />:<CompletedTestCard test={test} />}
  </> : <TestMetadata test={test} />;
  return (
    <Row>
      {loadingTest ? null : <>
      <Col md={24} sm={24} lg={0}>
          <TestCard plan={plan} testId={testId+''} />
          {/* Replace with card image */}
      {/* <CourseMetadata course={course} /> */}
      </Col>
        <Col lg={24} md={24} xs={0}>
          <Title level={3}>{test.title}</Title>
          <Title level={5} >
            {test.subtitle}
          </Title>
        </Col>
      </>}
         
<Col span={24}>
 <Row gutter={[30, 30]}>
 <Col xs={24} sm={24} md={24} lg={16} >
            <Row>
              {(test.landingPage?.promoVideo?.url) ? (
                <Col span={24}>
                  <Card
                    style={{ margin: '20px 0' }}
                    bordered={false}
                    bodyStyle={{ padding: 0 }}
                  >
                    <MediaPlayer
                      height={400}
                      url={test.landingPage.promoVideo.url}
                    />
                  </Card>
                </Col>
              ) : null}
              <Col span={24}>
                {loadingTest ? <Row>
                  <Col span={24}>
                  <SkeletonImage active style={{flex: 1,height:400}} />
                  <Skeleton active paragraph={{ rows: 20 }} />
                  </Col>
                </Row>:
                <Paragraph style={{ fontSize: 16 }}>
                  <HtmlViewer content={test.landingPage.description} />
                </Paragraph>
}
              </Col>
            </Row>
          </Col>
          <Col xs={0} sm={0} md={0} lg={8}>
            {/* @ts-ignore */}
            <TestCard testId={testId + ''} plan={test.plan} >
              {Metadata}
            </TestCard>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}


const TestCard = ({ testId ,plan,children}: { testId: string,plan: Types.Plan,children?:React.ReactNode}) => {
  const product = { type: 'test', id: testId };
  const navigate = useNavigate();
  // const loadingEnrolledTestDetails = true;
  const {
    data: enrolledDetails,
    isLoading: loadingEnrolledTestDetails
  } = Learner.Queries.useGetEnrolledProductDetails(product)
  const isEnrolled = Learner.Queries.useIsLearnerEnrolledToProduct(product);
  const { data: test, isLoading: loadingTest } = Learner.Queries.useGetTestDetails(testId + '','');
  const isLoading = loadingTest ;
  const testEndDate = enrolledDetails.metadata.test.endedAt || test.live.endedAt;
  const testStartDate =
    enrolledDetails.metadata.test.startedAt || test.live.startedAt;
  
  const Metadata = testEndDate ? (test.live.enabled?<CompletedLiveTestCard test={test} />:<CompletedTestCard test={test} />) : <TestMetadata test={test} />;
  const ENROLLED_CTA = useMemo(() => {
    if (loadingEnrolledTestDetails) {
      return <Skeleton.Button active block /> 
    }
    if (test.live.enabled) {
      if (testEndDate) {
        return <Alert
        style={{ marginBottom: 20 }}
        message={`Your test was submitted successfully` }
        type="success"
        showIcon
      />
      }
      switch (test.status) {

        case Enum.TestStatus.PUBLISHED: {
          return <Alert
          style={{ marginBottom: 20 }}
          message={<span>Test will begin in <Countdown targetDate={test.live.scheduledAt} /></span>}
          type="success"
          showIcon
        />
          break;
        }
          
        case Enum.TestStatus.IN_PROGRESS: {
  return <Fragment>
            <Alert
            style={{ marginBottom: 20 }}
            message="Test has started" action={<span>Time left: <TestTimeCountdown testId={testId} /> </span>}
            type='info'
              showIcon
              // action={ }
          />
             <Button onClick={() => navigate('start')} block type='primary'>
            Join Test
          </Button>
          </Fragment>
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
      // console.log(enrolledDetails.metadata.test, 'enrolledDetails')
      if (!testStartDate) {
        return <Button size='large' onClick={() => navigate('start')} block type='primary'>
          Start Test
        </Button>
      }
      if ((testStartDate)) {
        if (testEndDate) {
          return <>
          <Alert
            style={{ marginBottom: 20 }}
            message="You have attended this test."
            type="success"
            showIcon action={<Button size='small' onClick={() => navigate('result')}>View Result</Button>}
            />
          <Button onClick={()=>navigate('result/review')} type='primary' block>View solutions</Button>
          </>
        }
        else {
          return <Button onClick={() => navigate('start')} block type='primary'>
            Continue Test
          </Button>
        }
      }
     
    }
 
  }, [test, enrolledDetails]);
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn);
  const message = useMessage();
  const { isMobile,isTablet} = useBreakpoint();
  return   <Card
  bodyStyle={{ padding: 10, paddingBottom: 20 }}
  // style={{ height: '100%' }}
    title={test.title} extra={(isMobile || isTablet) ? <ActionDrawer title="Test Details"
      cta={<Button icon={<InfoOutlined />}>Show More</Button>} > {Metadata} </ActionDrawer>:null}
> {isLoading ?
  <>
                       {/* <Skeleton active paragraph={{ rows: 1 }} /> */}
    <Row gutter={[20, 10]}>
      <Col span={24}>
        <SkeletonImage style={{flex: 1,height: 200}}  />
      </Col>
      <Col span={24}>
        <Skeleton active paragraph={{ rows: 6 }} />
        </Col>
        <Col span={24}>
        <Skeleton.Button active block />
        </Col>
    </Row>
  </>:<>    <Row gutter={[20, 40]} align="stretch">
    <Col span={24}>
      <Image
        width={'100%'}
        height={200}
        preview={false}
        src={test.thumbnailImage}
      />
    </Col>
        <Col span={24} flex={1}>
        <Col span={24}>
          <Row justify="space-between" align='middle'>
        <Col>
            <Row align='middle' gutter={[5, 5]}>
                  <Col>
                    <Text strong style={{ fontSize: 24 }}>{plan.type === 'free' ? <>
                      <Title style={{ marginTop: 0 }} level={3}>Free</Title>
                    </> : UnitTypeToStr(plan.finalPrice)}
                    </Text>
                  </Col>
                  <Col>
                    {plan.displayPrice.value?<Text style={{ textDecoration: 'line-through' }} type='secondary'>{UnitTypeToStr(plan.displayPrice)}</Text>:null}
                  </Col>
          </Row>
        </Col>
       {plan.type!=='free' ?<Col>
          <Tag color="purple">{ Math.floor(Number(plan.discount))}% off</Tag>
        </Col>:null}
      </Row>
    </Col>
      <Col span={24}>
        <Row gutter={[10, 10]}>
              <Col span={24}>
                {children}
          </Col>
              <Col span={24}>
                {isSignedIn ? <>
                  {isEnrolled?ENROLLED_CTA:  <ProductCheckoutButton onSuccess={() => {
                    message.open({
                      type: 'success',
                      content: `You have enrolled successfully`
                    })                            }}
              product={{ type: 'test', id: testId + '' }}
              block
              type='primary'
            >
              Buy Now
                  </ProductCheckoutButton>}
                </> : <ActionModal width={300}
                    cta={<Button size="large" type="primary" block>
            Login to buy this course
                </Button>}>
                  <LearnerLogin/>
          </ActionModal>}
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
              Buy Now
            </ProductCheckoutButton>
          </Col>
        </Row>
      </Col>
    )} */}
  </Row></> }

</Card>
}