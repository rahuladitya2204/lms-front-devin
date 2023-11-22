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
import { Enum, Learner } from '@adewaskar/lms-common'
import { Outlet, useNavigate, useParams } from 'react-router'

import ActionDrawer from '@Components/ActionDrawer'
import Header from '@Components/Header'
import { MenuOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import ProctoringComponent from '@Learner/Screens/Procturing/TestProcturing'
import TestQuestionNavigator from './TestQuestionNavigator/TestQuestionNavigator'
import TestTimeCountdown from '@Components/TestTimeCountdown'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useEffect } from 'react'

const { confirm } = Modal

interface TestPlayerPropsI {
}

const { Title } = Typography

export default function TestPlayer(props: TestPlayerPropsI) {
  const { testId, questionId } = useParams();
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
  const { data: test } = Learner.Queries.useGetTestDetails(testId + '',Enum.TestDetailMode.TEST)
  const isProcturingOn = test.rules.procturing.enabled
  const { data: {
    status:{startedAt, hasStarted, hasEnded}
  },isLoading: loadingStatus } = Learner.Queries.useGetTestStatus(testId+'')
  
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
  const testEndTime = enrolledProduct.metadata.test.endedAt;

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
                // if (!test.live.enabled) {
                //   return navigate('../result')
                // }
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
  if (testEndTime) {
    return <Header title={test.title} extra={<NavLink to={'../'} ><Button type='primary'>Go Back</Button></NavLink>} >
      <Card>  
          <Title style={{textAlign:'center'}} >Test has ended.</Title>
      </Card>
    </Header>
  }
  const SideDrawer = <ActionDrawer footer={() => [
    // UpdatingTestStatus,
    SubmitTestButton]} cta={<Button icon={<MenuOutlined />}>
    </Button>}>
    <QuestionNavigator questionId={questionId + ''} testId={testId + ''} />
  </ActionDrawer>;
  return (
    <Spin spinning={loadingDetails || loadingStatus} >
      <Header
      title={test.title}
      subTitle={'asd'}
      extra={<Row>
        {!isDesktop ? <Col>
          {/* {UpdatingTestStatus} */}
       {(hasStarted&&!hasEnded)?<Tag color="blue">
        Time Left: <TestTimeCountdown testId={testId+''} /> 
          </Tag>:null}
        </Col>:null}
        <Col>
          {!isDesktop ? SideDrawer : <>
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
    </Header></Spin>

  )
}
