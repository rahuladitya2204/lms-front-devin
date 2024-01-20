import { Enum, Types, User } from '@adewaskar/lms-common'
import React, { useMemo } from 'react'
import Table, { TableColumn } from '@Components/Table/TableComponent'

import MoreButton from '@Components/MoreButton'
import { Tag } from 'antd'
// import OMRComponent from '@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/OMRComponent'
import { Title } from '@Components/Typography/Typography'
import { Typography } from '@Components/Typography'
import { capitalize } from 'lodash'
import dayjs from 'dayjs'
import useBreakpoint from '@Hooks/useBreakpoint'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useParams } from 'react-router'

const OMRComponent = React.lazy(() =>
  import('@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/OMRComponent')
)
const { Text } = Typography

const TestAttendedList = () => {
  const message = useMessage()
  const { testId } = useParams()
  const {
    data: { result: { data, metrics } },
    isLoading: loadingResult
  } = User.Queries.useGetTestDetails(testId + '')
  // console.log(data, 'data')
  const ranked = useMemo(
    () => {
      return [...data].map((i, index) => {
        // @ts-ignore
        i.rank = index + 1
        return i
      })
    },
    [data]
  )
  const { openModal } = useModal()
  const { isMobile } = useBreakpoint()
  return (
    // @ts-ignore
    <Table
      searchFields={['learner.name', 'learner.email']}
      // pagination={}
      dataSource={ranked}
      loading={loadingResult}
    >
      <TableColumn
        // responsive={['md']}
        title="Rank"
        render={(_: any, record: Types.TestLearnerResult, index: number) => (
          // @ts-ignore
          <Title style={{ fontSize: 18 }}>{record.rank}</Title>
        )}
        key="result"
      />
      <TableColumn
        // responsive={['md']}
        title="Student Name"
        dataIndex="learnerName"
        key="learnerName"
      />
      {/* {test.passingScore ? (
        <TableColumn responsive={['md']}
          title="Result"
          render={(_: any, record: Types.TestLearnerResult) => (
            <Tag
              color={
                record.status === 'passed' ? 'green-inverse' : 'red-inverse'
              }
            >
              {capitalize(record.status)}
            </Tag>
          )}
          key="result"
        />
      ) : null} */}
      <TableColumn
        responsive={['md']}
        title="Score"
        render={(_: any, record: Types.TestLearnerResult) => (
          <Tag color="blue-inverse">
            {Math.ceil(record?.metrics?.learnerScore)}/{Math.ceil(
              metrics?.totalTestScore
            )}
          </Tag>
        )}
        key="result"
      />
      <TableColumn
        responsive={['md']}
        title="Time Spent"
        render={(_: any, record: Types.TestLearnerResult) =>
          `${Math.ceil(record?.metrics?.timeSpent / 3600000)} min`
        }
        key="result"
      />
      {/* <TableColumn responsive={['md']}
        title="Percentile"
        render={(_: any, record: Types.TestLearnerResult) => (
          <Tag color="orange-inverse">{record?.metrics?.percentile}</Tag>
        )}
        key="percentile"
      /> */}
      <TableColumn
        responsive={['md']}
        title="Submitted At"
        render={(_: any, record: Types.TestLearnerResult) =>
          // @ts-ignore
          dayjs(record?.endedAt).format('LLL')
        }
        key="result"
      />{' '}
      <TableColumn
        // responsive={['md']}
        title="Action"
        key="action"
        render={(_: any, record: any) => {
          return (
            <MoreButton
              items={[
                {
                  label: 'Show Answer Sheet',
                  key: 'answer-sheet',
                  onClick: () => {
                    openModal(
                      <OMRComponent
                        readonly
                        learnerId={record.learnerId}
                        type="user"
                        testId={testId + ''}
                      />,
                      {
                        width: 850,
                        lazy: true,
                        title: `${record.learnerName}'s answer sheet`
                      }
                    )
                  }
                }
              ]}
            />
          )
        }}
      />
    </Table>
  )
}

export default TestAttendedList
