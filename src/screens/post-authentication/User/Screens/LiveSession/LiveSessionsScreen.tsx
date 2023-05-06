import { Button, Card, Col, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import AddLiveSession from './AddLiveSession'
import Header from '@Components/Header'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

function LiveSessionsScreen() {
  const { data, isLoading: loading } = User.Queries.useGetLiveSessions()

  return (
    <Header>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'LiveSessions'}
        extra={
          <ActionModal cta={<Button type="primary">Add LiveSession</Button>}>
            <AddLiveSession> </AddLiveSession>
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
                title="Designation"
                dataIndex="designation"
                key="designation"
              />
              {/* <Table.Column
                title="Last Login"
                dataIndex="lastActive"

              /> */}
              <Table.Column title="Courses" dataIndex="courses" key="courses" />
              <Table.Column title="Rating" dataIndex="rating" key="rating" />
              <Table.Column
                title="Joined On"
                dataIndex="createdAt"
                key="createdAt"
                render={(_: any, record: Types.LiveSession) => (
                  <Space size="middle">
                    {dayjs(record.startTime).format('LL')}
                  </Space>
                )}
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.LiveSession) => (
                  <Space size="middle">
                    <EditOutlined
                      onClick={() =>
                        window.open(
                          `LiveSessions/${record._id}/editor`,
                          '_blank'
                        )
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

export default LiveSessionsScreen
