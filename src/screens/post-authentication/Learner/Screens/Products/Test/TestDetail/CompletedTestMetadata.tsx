import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  ReadOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons'
import { Enum, Learner, Types, Utils } from '@invinciblezealorg/lms-common'
import { List, Tag } from 'antd'

import { Typography } from '@Components/Typography'
import dayjs from 'dayjs'
import styled from '@emotion/styled'

const { Text } = Typography

const ListItem = styled(List.Item)`
  padding: 5px 15px;
`

const data = {
  takenOn: {
    title: 'Taken On',
    icon: <CalendarOutlined />,
    value: ''
  },
  // timeTaken: {
  //   title: 'Time Taken',
  //   icon: <ClockCircleOutlined />,
  //   value: '43 Weeks'
  // },
  score: {
    title: 'Score',
    icon: <CheckCircleOutlined />,
    value: '1'
  },
  language: {
    title: 'Language',
    icon: <CopyOutlined />,
    value: 'English'
  },
  // skillLevel: {
  //   title: 'Skill Level',
  //   icon: <CheckCircleOutlined />,
  //   value: 'Beginner'
  // },
  result: {
    title: 'Result',
    icon: <SafetyCertificateOutlined />,
    value: <span />
  }
}

interface CompletedTestCardPropsI {
  test: Types.Test;
}

function CompletedTestCard(props: CompletedTestCardPropsI) {
  const test = props.test
  const testId = props.test._id
  const {
    data: { test: testResult, status, metrics: { learnerScore, passingScore } },
    isFetching: loadingResult
  } = Learner.Queries.useGetTestResult(testId + '')
  const {
    data: enrolledDetails
  } = Learner.Queries.useGetEnrolledProductDetails(
    {
      type: 'test',
      id: testId + ''
    },
    {
      enabled: !!testId
    }
  )
  const testStartDate = enrolledDetails.metadata.test.startedAt

  const testEndDate = enrolledDetails.metadata.test.endedAt
  // @ts-ignore
  data.takenOn.value = dayjs(testStartDate).format('LL')
  // data.timeTaken.value = formatTime(
  //   dayjs(testEndDate)
  //     .toDate()
  //     .getTime() -
  //     dayjs(testEndDate)
  //       .toDate()
  //       .getTime()
  // )
  if (status === Enum.TestResultStatus.EVALUATED) {
    data.score.value = `${Math.ceil(learnerScore)}/${Math.ceil(passingScore)}`
    // @ts-ignore
    const isPassed = learnerScore >= passingScore
    data.result.value = isPassed ? (
      <Tag style={{ marginRight: 0 }} color="green-inverse">
        Passed
      </Tag>
    ) : (
      <Tag style={{ marginRight: 0 }} color="red-inverse">
        Failed
      </Tag>
    )
  } else {
    data.score.value = ''
    // @ts-ignore
    data.result.value = null
  }
  // @ts-ignore

  // @ts-ignore
  const dataSource = Object.keys(data).map(key => data[key]).filter(i => i.value);
  return (
    <List
      itemLayout="horizontal"
      dataSource={dataSource}
      renderItem={item => (
        <ListItem actions={[<Text strong>{item.value}</Text>]}>
          <List.Item.Meta
            avatar={item.icon}
            title={<Text strong>{item.title}</Text>}
          />
        </ListItem>
      )}
    />
  )
}

export default CompletedTestCard
