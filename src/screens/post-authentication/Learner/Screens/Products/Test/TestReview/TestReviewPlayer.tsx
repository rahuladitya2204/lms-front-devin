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
  Tag,
  Timeline,
  Typography
} from 'antd'
import { Learner, Store } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'
import { useEffect, useMemo } from 'react'

import ActionDrawer from '@Components/ActionDrawer'
import Countdown from '@Components/Countdown'
import Header from '@Components/Header'
import { MenuOutlined } from '@ant-design/icons'
import ProctoringComponent from '@Learner/Screens/Procturing/TestProcturing'
import TestPlayerMoreInfo from './TestPlayerMoreInfo'
import TestReviewQuestionNavigator from './TestQuestionReviewNavigator'
import TestTimeCountdown from '@Components/TestTimeCountdown'
import dayjs from 'dayjs'
import useBreakpoint from '@Hooks/useBreakpoint'

// const ProctoringComponent = lazy(() => import('@Learner/Screens/Procturing/TestProcturing'));

const { confirm } = Modal

interface TestPlayerPropsI {
  isReview?: boolean;
}

const { Title } = Typography

export default function TestReviewPlayer(props: TestPlayerPropsI) {
  const { testId,questionId } = useParams()
  const navigate = useNavigate()
  const {
    mutate: endTest,
    isLoading: submittingTest
  } = Learner.Queries.useEndTest()
  const {
    data: enrolledProduct
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: 'test',
    id: testId + ''
  })
  const { data: test } = Learner.Queries.useGetTestDetails(testId + '')
  const isProcturingOn = test.rules.procturing.enabled
  const {
    startedAt, hasStarted, hasEnded
  } = Store.useTestStore(s => s.testStatus)

  const endingAt = useMemo(() => dayjs(startedAt)
    .add(test.duration.value, 'minutes')
    .toString(), [startedAt, test]);
  
  useEffect(
    () => {
      if (test.sections[0]?.items[0] && !questionId) {
        const itemId = test.sections[0].items[0]._id
        navigate(`${itemId}`)
      }
    },
    [test.sections]
  );
  
  const endTestNow =
    enrolledProduct.metadata.test.endedAt ||
    enrolledProduct.metadata.test.submittedAt

  if (endTestNow) {
    // navigate('../completed')
  };
  const testEndTime = enrolledProduct.metadata.test.endedAt || test.live.endedAt;

  const { isTablet, isDesktop, isMobile } = useBreakpoint();
 
const ExitButton = <Button style={{width:100}}
onClick={() => {
  confirm({
    title: 'Are you sure?',
    // icon: <ExclamationCircleOutlined />,
    content: `You want to exit reviewing?`,
    onOk() {
      navigate('../')
    },
    okText: 'Yes, Exit'
  })
}}
type="default" danger
loading={submittingTest}
>
Exit
</Button>;
  const QuestionNavigator = TestReviewQuestionNavigator
  return (
    <>
     {/* {hasEnded?<Alert
      message="The Test has ended"
      banner type='error'
      closable
      />:null} */}
        <Header
      title={test.title}
      subTitle={'asd'}
      extra={ExitButton}
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
              {/* <Title
                level={5}
                style={{
                  textAlign: 'center',
                  display: 'block',
                  margin: 0,
                  marginBottom: 10
                }}
              >
                {totalQuestions - totalAnswered} Questions Left
                <Progress
                  strokeLinecap="butt"
                  percent={
                    (1 - (totalQuestions - totalAnswered) / totalQuestions) *
                    100
                  }
                  format={() => ``}
                />
              </Title> */}
                <Outlet />
              {/* only show if the test has ended */}
              <Card style={{marginTop:20}}>
                <TestPlayerMoreInfo itemId={questionId+''} test={test} />
              </Card>
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
