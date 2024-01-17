import { Button, Card, Col, Modal, Row, Space, Tag } from 'antd'
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import { Enum, Types } from '@adewaskar/lms-common'
import Table, { TableColumn } from '@Components/Table/TableComponent'

import MoreButton from '@Components/MoreButton'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

const confirm = Modal.confirm

function LearnersTable() {
  const { data, isFetching: loading } = User.Queries.useGetLearners()
  const {
    mutate: deleteLearner,
    isLoading: deletingLearner
  } = User.Queries.useDeleteLearner()
  const {
    mutate: changeAccountStatus
  } = User.Queries.useUpdateLearnerAccountStatus()
  return (
    <Table
      searchFields={['name', 'email', 'contactNo']}
      dataSource={data}
      loading={loading || deletingLearner}
    >
      <TableColumn
        title="Name"
        render={(_: any, record: Types.Learner) => record.name || '-'}
        dataIndex="name"
        key="name"
      />
      <TableColumn
        title="Email Adress"
        dataIndex="email"
        key="email"
        render={(_: any, record: Types.Learner) => record.email || '-'}
      />
      <TableColumn title="Contact No" dataIndex="contactNo" key="contactNo" />
      <TableColumn
        title="Profile Status"
        dataIndex="profile.status"
        key="profile.status"
        render={(_: any, record: Types.Learner) =>
          record.profile.status === 'incomplete' ? (
            <Tag color="red-inverse">Incomplete</Tag>
          ) : (
            <Tag color="green-inverse">Complete</Tag>
          )
        }
      />
      <TableColumn
        title="Last Login"
        dataIndex="lastActive"
        key="lastActive"
        render={(_: any, record: Types.Learner) => (
          <Space size="middle">{dayjs(record.lastActive).format('LLLL')}</Space>
        )}
      />
      <TableColumn
        title="Joined On"
        dataIndex="createdAt"
        key="createdAt"
        render={(_: any, record: Types.Learner) => (
          <Space size="middle">{dayjs(record.createdAt).format('LL')}</Space>
        )}
      />
      <TableColumn
        title="Action"
        key="action"
        render={(_: any, record: Types.User) => (
          <MoreButton
            items={[
              {
                label:
                  record.status === Enum.LearnerAccountStatus.ACTIVE
                    ? 'Revoke Access'
                    : 'Release Access',
                key: 'change-status',
                icon: <CloseOutlined />,
                onClick: () => {
                  confirm({
                    title: 'Are you sure?',
                    // icon: <ExclamationCircleOutlined />,
                    content: `You want to ${
                      record.status === Enum.LearnerAccountStatus.ACTIVE
                        ? 'revoke'
                        : 'release'
                    } access for this learner`,
                    onOk() {
                      changeAccountStatus({
                        id: record._id,
                        status:
                          record.status === Enum.LearnerAccountStatus.ACTIVE
                            ? Enum.LearnerAccountStatus.INACTIVE
                            : Enum.LearnerAccountStatus.ACTIVE
                      })
                    },
                    okText:
                      record.status === Enum.LearnerAccountStatus.ACTIVE
                        ? 'Revoke'
                        : 'Give access'
                  })
                }
              },
              {
                label: 'Remove Learner',
                key: 'remove',
                icon: <DeleteOutlined />,
                onClick: () => {
                  confirm({
                    title: `Are you sure? You want to remove ${record.name ||
                      record.email}`,
                    // icon: <ExclamationCircleOutlined />,
                    content: `Learner will no longer have any access to the platform`,
                    onOk() {
                      deleteLearner(record._id)
                    },
                    okText: 'Revoke access'
                  })
                }
              }
            ]}
          />
        )}
      />
    </Table>
  )
}

export default LearnersTable
