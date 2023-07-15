import { Button, Card, Col, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

function LearnersTable() {
    const { data, isLoading: loading } = User.Queries.useGetLearners();
  return (
    <Table dataSource={data} loading={loading}>
      <Table.Column title="Name" dataIndex="name" key="name" />
      <Table.Column title="Email Adress" dataIndex="email" key="email" />

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
        render={(_: any, record: Types.Learner) => (
          <Space size="middle">
            {/* <EditOutlined
            onClick={() =>
              window.open(`learners/${record._id}/editor`, '_blank')
            }
          /> */}
            <DeleteOutlined />
          </Space>
        )}
      />
    </Table>
  )
}

export default LearnersTable
