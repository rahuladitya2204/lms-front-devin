import {
  Button,
  Card,
  Col,
  Collapse,
  Progress,
  Row,
  Space,
  Tag,
  Timeline,
  Typography
} from 'antd'
import { CaretRightOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Navigate, Outlet, useNavigate, useParams } from 'react-router'
import { useEffect, useMemo } from 'react'

import Countdown from '@Components/Countdown'
import Header from '@Components/Header'
import { Learner } from '@adewaskar/lms-common'
import LiveTestQuestionNavigator from './LiveTestQuestionNavigator/LiveTestQuestionNavigator'
import dayjs from 'dayjs'
import { i } from 'mathjs'

interface LiveTestPlayerPropsI {}

const { Title } = Typography

export default function LiveTestPlayer(props: LiveTestPlayerPropsI) {
  const { testId } = useParams()
  const navigate = useNavigate()
  const { data: liveTest } = Learner.Queries.useGetLiveTestDetails(testId + '')
  const {
    data: { totalAnswered, totalQuestions }
  } = Learner.Queries.useGetLiveTestStatus(testId + '')
  const endTime = useMemo(
    () =>
      liveTest.scheduledAt
        ? dayjs(liveTest.scheduledAt)
            .add(liveTest.duration, 'minutes')
            .toISOString()
        : '',
    [testId]
  )

  useEffect(
    () => {
      if (liveTest.sections[0]?.items[0]) {
        const sectionId = liveTest.sections[0]._id
        const itemId = liveTest.sections[0].items[0]._id
        navigate(`section/${sectionId}/${itemId}`)
      }
    },
    [liveTest.sections]
  )

  // const currentQuestion=
  return (
    <Header
      title={liveTest.title}
      extra={[
        <Tag icon={<ClockCircleOutlined />} color="blue">
          <Countdown targetDate={endTime} />
        </Tag>,
        <Button type="primary">Finish Test</Button>
      ]}
    >
      <Row>
        <Col span={1} />
        <Col span={22}>
          <Row gutter={[20, 30]}>
            <Col span={8}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <LiveTestQuestionNavigator liveTestId={testId + ''} />
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
