import {
    Button,
    Card,
    Col,
    Collapse,
    Divider,
    List,
    Progress,
    Row,
    Spin,
    Tag,
    Typography
} from 'antd'
import { CheckCircleTwoTone, InfoCircleOutlined } from '@ant-design/icons'
import { Fragment, useMemo } from 'react'
import { Learner, Store } from '@adewaskar/lms-common'

import Countdown from '@Components/Countdown'
import { NavLink } from 'react-router-dom'
import dayjs from 'dayjs'
import styled from 'styled-components'
import useBreakpoint from '@Hooks/useBreakpoint'
import useCountdownTimer from '@Hooks/useCountdownTimer'

interface TestQuestionNavigatorType2PropsI {
    testId: string;
    questionId: string;
  }
  
const { Text, Title } = Typography
  
interface TestTimerPropsI {
    testId:string
}
  
export default function TestTimer(props: TestTimerPropsI) {
    const { data: test,isLoading: loadingTest } = Learner.Queries.useGetTestDetails(props.testId + '')
      const {
        data: { status: {
          startedAt
        }}
      } = Learner.Queries.useGetTestStatus(props.testId + '')
  
  const endingAt = useMemo(() => dayjs(startedAt)
    .add(test.duration.value, 'minutes')
    .toString(), [startedAt, test]);
  
  const { percentLeft } = useCountdownTimer(endingAt);
  
    return  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0
    }}
    title="Time Spent"
  >
    <Progress
      size={200}
      format={(percent) => {
        return (
          <Row>
            <Col span={24}>
              {percent===100? <Title type="secondary" style={{ fontSize: 18 }}>
                Test has ended
              </Title> : <>
              <Title type="secondary" style={{ fontSize: 18 }}>
                Remaining Time
              </Title>
              <Title style={{ marginTop: 0, fontSize: 25 }}>
                    <Countdown targetDate={ endingAt} />
                </Title>
              </>}
              
            </Col>
          </Row>
        )
      }}
      type="circle"
      percent={Math.ceil(100 - percentLeft)}
    />
  </div>
}