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

import Countdown from '@Components/Countdown'
import { Fragment } from 'react'
import { Learner } from '@adewaskar/lms-common'
import { NavLink } from 'react-router-dom'
import dayjs from 'dayjs'
import styled from 'styled-components'
import useBreakpoint from '@Hooks/useBreakpoint'
import useCountdownTimer from '@Hooks/useCountdownTimer'
import { useNavigate } from 'react-router'

interface TestQuestionNavigatorType2PropsI {
    testId: string;
    questionId: string;
  }
  
const { Text, Title } = Typography
  
interface TestTimerPropsI {
    testId:string
}
  
export default function TestTimer(props: TestTimerPropsI) {
    const { testId} = props;
    const { data: test,isLoading: loadingTest } = Learner.Queries.useGetTestDetails(props.testId + '')
    const {
        data: enrolledProduct, isLoading: loadingEnrolledTest
      } = Learner.Queries.useGetEnrolledProductDetails({
        type: 'test',
        id: testId + ''
      })
    const endingAt = dayjs(enrolledProduct.metadata.test.startedAt)
    .add(test.duration.value, 'minutes')
    .toString()
    const { percentLeft } = useCountdownTimer(endingAt)
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