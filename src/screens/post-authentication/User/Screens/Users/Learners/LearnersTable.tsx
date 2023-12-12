import { Button, Card, Col, Modal, Row, Space, Table } from 'antd'

import { DeleteOutlined } from '@ant-design/icons'
import MoreButton from '@Components/MoreButton'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

const confirm = Modal.confirm

function LearnersTable() {
  const { data, isFetching: loading } = User.Queries.useGetLearners()
  return (
    <Table dataSource={data} loading={loading}>
      <Table.Column title="Name" dataIndex="name" key="name" />
      <Table.Column title="Email Adress" dataIndex="email" key="email" />
      <Table.Column title="Contact No" dataIndex="contactNo" key="contactNo" />

      <Table.Column
        title="Last Login"
        dataIndex="lastActive"
        key="lastActive"
        render={(_: any, record: Types.Learner) => (
          <Space size="middle">{dayjs(record.lastActive).format('LLLL')}</Space>
        )}
      />
      <Table.Column
        title="Joined On"
        dataIndex="createdAt"
        key="createdAt"
        render={(_: any, record: Types.Learner) => (
          <Space size="middle">{dayjs(record.createdAt).format('LL')}</Space>
        )}
      />
      <Table.Column
        title="Action"
        key="action"
        render={(_: any, record: Types.Instructor) => (
          <MoreButton
            items={[
              {
                label: 'Revoke access',
                key: 'revoke',
                icon: <DeleteOutlined />,
                onClick: () => {
                  confirm({
                    title: 'Are you sure?',
                    // icon: <ExclamationCircleOutlined />,
                    content: `You want to access for this learner`,
                    onOk() {
                      // deleteFile({ id: record._id })
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
