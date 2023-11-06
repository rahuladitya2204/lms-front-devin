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
import { CaretRightOutlined, ClockCircleOutlined, MenuOutlined } from '@ant-design/icons'
import { Enum, Learner } from '@adewaskar/lms-common'
import { Navigate, Outlet, useNavigate, useParams } from 'react-router'
import { lazy, useEffect, useMemo } from 'react'

import ActionDrawer from '@Components/AcrtionDrawer'
import Countdown from '@Components/Countdown'
import Header from '@Components/Header'
import TestQuestionNavigator from './TestQuestionNavigator/Type2/TestQuestionNavigator'
import dayjs from 'dayjs'
import useBreakpoint from '@Hooks/useBreakpoint'

const ProctoringComponent = lazy(() => import('@Learner/Screens/Procturing/TestProcturing'));

const { confirm } = Modal

interface TestPlayerPropsI {}

const { Title } = Typography

export default function TestPlayer(props: TestPlayerPropsI) {
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
    data: { totalAnswered, totalQuestions, status }
  } = Learner.Queries.useGetTestStatus(testId + '')
  console.log(dayjs(enrolledProduct?.metadata?.test?.startedAt).format('LLL'))
  const startTime =  test.startedAt || enrolledProduct.metadata.test.startedAt

  useEffect(
    () => {
      if (test.sections[0]?.items[0]) {
        const sectionId = test.sections[0]._id
        const itemId = test.sections[0].items[0]._id
        navigate(`${itemId}`)
      }
    },
    [test.sections]
  )
  const endTestNow =
    enrolledProduct.metadata.test.endedAt ||
    enrolledProduct.metadata.test.submittedAt

  if (endTestNow) {
    // navigate('../completed')
  }
  const endTime = dayjs(startTime).add(test.duration, 'minute');
  const {isTablet,isDesktop,isMobile } = useBreakpoint();
  return (
    <Header
      title={test.title}
      subTitle={'asd'}
      extra={<Row>
        {!isDesktop?<Col>
       <Tag color="blue">
        Time Left: <Countdown targetDate={endTime.toString()} />
          </Tag>
        </Col>:null}
        <Col>
        {!isDesktop ? <ActionDrawer cta={<Button icon={<MenuOutlined />}>
        </Button>}>        <TestQuestionNavigator questionId={questionId+''} testId={testId + ''} />
</ActionDrawer>: <Button
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
                      if (!test.isLive) {
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
        </Button>}
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

              <Card>
                <Outlet />
              </Card>
            </Col>
            <Col lg={8} md={0}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <TestQuestionNavigator questionId={questionId+''} testId={testId + ''} />
                </Col>
              </Row>
            </Col>
         
          </Row>
        </Col>
        <Col span={1} />
      </Row>
    </Header>
  )
}
