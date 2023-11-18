import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  Modal,
  Progress,
  Row,
  Space,
  Spin,
  Tag,
  Timeline,
  Typography
} from 'antd'
import { Learner, Store } from '@adewaskar/lms-common'
import { MenuOutlined, SyncOutlined } from '@ant-design/icons'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useEffect, useMemo } from 'react'

import ActionDrawer from '@Components/ActionDrawer'
import Countdown from '@Components/Countdown'
import Header from '@Components/Header'
import ProctoringComponent from '@Learner/Screens/Procturing/TestProcturing'
import TestPlayerMoreInfo from '../TestReview/TestPlayerMoreInfo'
import TestQuestionNavigator from './TestQuestionNavigator/TestQuestionNavigator'
import TestTimeCountdown from '@Components/TestTimeCountdown'
import dayjs from 'dayjs'
import useBreakpoint from '@Hooks/useBreakpoint'

// const ProctoringComponent = lazy(() => import('@Learner/Screens/Procturing/TestProcturing'));

const { confirm } = Modal

interface TestPlayerPropsI {
}

const { Title } = Typography

export default function TestPlayer(props: TestPlayerPropsI) {
  const { testId, questionId } = useParams();
  const initializeStore = Store.useTestStore(s => s.initializeStore);
  const navigate = useNavigate()
  const {
    mutate: endTest,
    isLoading: submittingTest
  } = Learner.Queries.useEndTest()
  const {
    data: enrolledProduct,
    isLoading: loadingDetails
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'test',
    id: testId + ''
  })
  const { data: test } = Learner.Queries.useGetTestDetails(testId + '')
  const isProcturingOn = test.rules.procturing.enabled
  const { startedAt, hasStarted, hasEnded } = Store.useTestStore(s => s.testStatus);
  
  useEffect(
    () => {
      if (test.sections[0]?.items[0] && !questionId) {
        const itemId = test.sections[0].items[0]._id
        navigate(`${itemId}`)
      }
    },
    [test.sections]
  );

  useEffect(() => {
    if (test._id && enrolledProduct._id) {
      console.log(test,enrolledProduct,'lklklk')
      initializeStore(enrolledProduct, test);
    }
   },[test._id,enrolledProduct._id])
  
  const endTestNow =
    enrolledProduct.metadata.test.endedAt ||
    enrolledProduct.metadata.test.submittedAt

  if (endTestNow) {
    // navigate('../completed')
  };
  const testEndTime = enrolledProduct.metadata.test.endedAt || test.endedAt;

  const { isTablet, isDesktop, isMobile } = useBreakpoint();
 
  const SubmitTestButton = <Button block={!isDesktop}
    onClick={() => {
      confirm({
        title: 'Are you sure?',
        // icon: <ExclamationCircleOutlined />,
        content: `You want to submit this test?`,
        onOk() {
          endTest(
            { testId: test._id + '' },
            {
              onSuccess: () => {
                if (!test.live.enabled) {
                  return navigate('../result')
                }
                navigate('../completed')

              }
            }
          )
        },
        okText: 'Yes, Submit'
      })
    }}
    type="primary" danger
    loading={submittingTest}
  >
    Submit Test
  </Button>

  const QuestionNavigator = TestQuestionNavigator;
  const { mutate: updateTestStatus,isLoading: updatingTestStatus}=Learner.Queries.useUpdateTestStatus(testId+'')
  const enrolledTest = Store.useTestStore(s => s.enrolledProduct);
  useEffect(() => {
    const int = setInterval(() => {
      console.log(enrolledTest, 'enrolledTest')
      updateTestStatus({
        responses: Store.useTestStore.getState().enrolledProduct.metadata.test.responses
      });
    }, 10000)
    return () => {
      clearInterval(int);
    }
  }, [testId]);
  const UpdatingTestStatus = updatingTestStatus ? <Tag icon={<SyncOutlined spin />} color="processing">
    Updating Test
  </Tag> : null;
  return (
    <>
      <Header
      title={test.title}
      subTitle={'asd'}
      extra={<Row>
        {!isDesktop?<Col> {UpdatingTestStatus}
       {(hasStarted&&!hasEnded)?<Tag color="blue">
        Time Left: <TestTimeCountdown testId={testId+''} /> 
          </Tag>:null}
        </Col>:null}
        <Col>
          {!isDesktop ? <ActionDrawer footer={() => [UpdatingTestStatus,SubmitTestButton]} cta={<Button icon={<MenuOutlined />}>
          </Button>}>
            <QuestionNavigator questionId={questionId + ''} testId={testId + ''} />
          </ActionDrawer> : <>
          <Tag icon={<SyncOutlined spin={updatingTestStatus} />} color="processing">
            {updatingTestStatus?'Syncing Changes':`Last updated ${dayjs(enrolledProduct.metadata.test.lastUpdated).format('h:mm A')}`}
          </Tag>
              {SubmitTestButton}
          </>}
      </Col>
      </Row>}
    >
      {isProcturingOn ? <><ProctoringComponent />   <Alert
        style={{ marginBottom: 50 }}
        message="Please Note: This exam is being proctured. Any suspicious activity will be reported and submit the test immediately."
        type="info"
        showIcon
      /></>: null}
    
      <Row>
        <Col span={1} />
        <Col span={22}>
          <Row gutter={[50, 30]}>
          <Col md={24} lg={16}>
                <Spin spinning={loadingDetails} >
                <Outlet />
              </Spin>
               
              {/* only show if the test has ended */}
              {/* {testEndTime?<Card style={{marginTop:20}}>
                <TestPlayerMoreInfo itemId={questionId+''} test={test} />
              </Card>:null} */}
            </Col>
            {isDesktop?<Col lg={8} md={0}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <QuestionNavigator questionId={questionId+''} testId={testId + ''} />
                </Col>
              </Row>
            </Col>:null}
         
          </Row>
        </Col>
        <Col span={1} />
      </Row>
    </Header></>

  )
}
