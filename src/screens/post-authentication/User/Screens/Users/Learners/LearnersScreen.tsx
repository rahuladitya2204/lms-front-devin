import { Button, Card, Col, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import AddLearner from './AddLearners'
import Header from '@Components/Header'
import ThemeProvider from 'screens/ThemeProvider'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

function LearnersScreen() {
  const { data, isLoading: loading } = User.Queries.useGetLearners()

  return (
    <Header>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Learners'}
        extra={
          <ActionModal cta={<Button type="primary">Add Learner</Button>}>
            <AddLearner> </AddLearner>
          </ActionModal>
        }
      >
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading}>
              <Table.Column title="Name" dataIndex="name" key="name" />
              <Table.Column
                title="Email Adress"
                dataIndex="email"
                key="email"
              />

              <Table.Column
                title="Last Login"
                dataIndex="lastActive"
                key="lastActive"
                render={(_: any, record: Types.Learner) => (
                  <Space size="middle">
                    {dayjs(record.lastActive).format('LLLL')}
                  </Space>
                )}
              />
              <Table.Column
                title="Joined On"
                dataIndex="createdAt"
                key="createdAt"
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Learner) => (
                  <Space size="middle">
                    <EditOutlined
                      onClick={() =>
                        window.open(`learners/${record._id}/editor`, '_blank')
                      }
                    />
                    <DeleteOutlined />
                  </Space>
                )}
              />
            </Table>
          </Col>
        </Row>
      </Card>
    </Header>
  )
}

export default LearnersScreen
