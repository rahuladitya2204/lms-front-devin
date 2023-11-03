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
import { CaretRightOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Enum, Learner } from '@adewaskar/lms-common'
import { Navigate, Outlet, useNavigate, useParams } from 'react-router'
import { useEffect, useMemo } from 'react'

import Countdown from '@Components/Countdown'
import Header from '@Components/Header'
import ProctoringComponent from '@Learner/Screens/Procturing/TestProcturing'
import TestQuestionNavigator from './TestQuestionNavigator/TestQuestionNavigator'
import dayjs from 'dayjs'
import { i } from 'mathjs'

const { confirm } = Modal

interface TestPlayerPropsI {}

const { Title } = Typography

export default function TestPlayer(props: TestPlayerPropsI) {
  const { testId } = useParams()
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
  const endingAt = dayjs(enrolledProduct.metadata.test.startedAt)
    .add(test.duration, 'minutes')
    .toString()

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

  return (
    <Header
      title={test.title}
      subTitle={'asd'}
      extra={[
        <Tag icon={<ClockCircleOutlined />} color="blue">
          <Countdown targetDate={endingAt} />
        </Tag>,
        <Button
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
                       return navigate('../result-table')  
                      }
                      navigate('../completed')  

                    }
                  }
                )
              },
              okText: 'Yes, Submit'
            })
          }}
          type="primary"
          loading={submittingTest}
        >
          Submit Test
        </Button>
      ]}
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
          <Row gutter={[20, 30]}>
            <Col span={8}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <TestQuestionNavigator testId={testId + ''} />
                </Col>
              </Row>
            </Col>
            <Col span={16}>
              <Title
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
              </Title>

              <Card>
                <Outlet />
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={1} />
      </Row>
    </Header>
  )
}
