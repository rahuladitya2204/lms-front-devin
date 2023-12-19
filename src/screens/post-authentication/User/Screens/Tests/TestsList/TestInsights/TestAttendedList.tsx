import { Enum, Types, User } from '@adewaskar/lms-common'
import {
  Table,
  Tag,
} from 'antd'

import { Typography } from '@Components/Typography'
import { capitalize } from 'lodash'
import dayjs from 'dayjs'
import { useParams } from 'react-router'

const { Text } = Typography

const TestAttendedList = () => {
  const { testId } = useParams()
  const { data } = User.Queries.useGetTestResult(testId + '')
  const { data: test } = User.Queries.useGetTestDetails(testId + '')
  const TOTAL_POSSIBLE_SCORE = test.sections.reduce((acc, section) => {
    const sectionScore = section.items.reduce(
      (sectionAcc, item) => sectionAcc + (item.score.correct || 0),
      0
    )
    return acc + sectionScore
  }, 0)
  return (
    <Table dataSource={data}>
      <Table.Column
        title="Student Name"
        dataIndex="learnerName"
        key="learnerName"
      />
      <Table.Column
        title="Result"
        render={(_: any, record: Types.TestLearnerResult) => (
          <Tag
            color={record.status === 'passed' ? 'green-inverse' : 'red-inverse'}
          >
            {capitalize(record.status)}
          </Tag>
        )}
        key="result"
      />
      <Table.Column
        title="Score"
        render={(_: any, record: Types.TestLearnerResult) =>
          `${record.score} marks (${record.score /
            TOTAL_POSSIBLE_SCORE *
            100}%)`
        }
        key="result"
      />

      <Table.Column
        title="Time Spent"
        render={(_: any, record: Types.TestLearnerResult) =>
          `${Math.ceil(record.timeSpent / 3600000)} min`
        }
        key="result"
      />

      <Table.Column
        title="Percentile"
        render={(_: any, record: Types.TestLearnerResult) => (
          <Tag color="orange-inverse">{record.percentile}</Tag>
        )}
        key="percentile"
      />

      <Table.Column
        title="Submitted At"
        render={(_: any, record: Types.TestLearnerResult) =>
          dayjs(record.submittedAt).format('LLL')
        }
        key="result"
      />
    </Table>
  )
}

export default TestAttendedList
