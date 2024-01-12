import { BookOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Enum, Types, User } from '@adewaskar/lms-common'
import { Modal, Table, Tag } from 'antd'
import React, { useMemo } from 'react'

import MoreButton from '@Components/MoreButton'
import TestStatusTag from './TestStatusTag'
// import OMRComponent from '@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/OMRComponent'
import { Title } from '@Components/Typography/Typography'
import { Typography } from '@Components/Typography'
import { capitalize } from 'lodash'
import dayjs from 'dayjs'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useParams } from 'react-router'

const { confirm } = Modal
const OMRComponent = React.lazy(() =>
  import('@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/OMRComponent')
)
const { Text } = Typography

const TestEnrolledList = () => {
  const { testId } = useParams()
  const {
    data: enrolledProducts,
    isLoading: loadingEp
  } = User.Queries.useGetEnrolledProductLearners(testId + '')
  const {
    mutate: removeEnrollment,
    isLoading: removingEnrollment
  } = User.Queries.useRemoveEnrollmentOfLearner(testId + '')
  console.log(enrolledProducts, 'papa')
  const { openModal } = useModal()
  return (
    // @ts-ignore
    <Table
      dataSource={enrolledProducts}
      loading={loadingEp || removingEnrollment}
    >
      {/* <Table.Column
        title="Rank"
        render={(_: any, record: Types.TestLearnerResult, index: number) => (
          // @ts-ignore
          <Title style={{ fontSize: 18 }}>{record.rank}</Title>
        )}
        key="result"
      /> */}
      <Table.Column
        title="Student Name"
        dataIndex="learner.name"
        key="learner.name"
        render={(_: any, record: Types.EnrolledProductDetails) =>
          //   @ts-ignore
          record.learner.name
        }
      />
      <Table.Column
        title="Test Status"
        dataIndex="learner.name"
        key="learner.name"
      />
      {/* {test.passingScore ? (
        <Table.Column
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
      <Table.Column
        title="Test Status"
        render={(_: any, record: Types.EnrolledProductDetails) => (
          <TestStatusTag ep={record} />
        )}
        key="result"
      />
      {/* <Table.Column
        title="Time Spent"
        render={(_: any, record: Types.TestLearnerResult) =>
          `${Math.ceil(record?.metrics?.timeSpent / 3600000)} min`
        }
        key="result"
      /> */}
      {/* <Table.Column
        title="Percentile"
        render={(_: any, record: Types.TestLearnerResult) => (
          <Tag color="orange-inverse">{record?.metrics?.percentile}</Tag>
        )}
        key="percentile"
      /> */}
      <Table.Column
        title="Enrolled At"
        render={(_: any, record: Types.TestLearnerResult) =>
          // @ts-ignore
          dayjs(record?.enrolledAt).format('LLL')
        }
        key="result"
      />{' '}
      <Table.Column
        title="Action"
        key="action"
        render={(_: any, record: any) => {
          return (
            <MoreButton
              items={[
                {
                  label: 'Show Answer Sheet',
                  key: 'answer-sheet',
                  icon: <BookOutlined />,
                  onClick: () => {
                    openModal(
                      <OMRComponent
                        readonly
                        learnerId={record.learner._id}
                        type="user"
                        testId={testId + ''}
                      />,
                      {
                        width: 600,
                        lazy: true,
                        title: `${record.learner.name}'s answer sheet`
                      }
                    )
                  }
                },
                {
                  label: 'Delete Enrollment',
                  key: 'remove-enrollment',
                  icon: <DeleteOutlined />,
                  onClick: () => {
                    confirm({
                      title:
                        "Are you sure? You want to delete this user's enrollment",
                      // icon: <ExclamationCircleOutlined />,
                      content: `The user will loose access to current enrollment`,
                      onOk() {
                        removeEnrollment({ learnerId: record.learner._id })
                      },
                      okText: 'Delete Enrollment'
                    })
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

export default TestEnrolledList
