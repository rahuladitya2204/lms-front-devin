import { Button, Card, Col, Row, Space, Table } from 'antd'
import { Common, Types } from '@adewaskar/lms-common'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import Header from '@Components/Header'
import dayjs from 'dayjs'

function AssetLibraryScreen() {
  const { data, isLoading: loading } = Common.Queries.useGetFiles()

  return (
    <Header>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Asset Library'}
      >
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading}>
              <Table.Column title="Name" dataIndex="name" key="name" />
              <Table.Column
                title="Modified On"
                dataIndex="updatedAt"
                key="updatedAt"
                render={(_: any, record: { updatedAt: string }) => (
                  <Space size="middle">
                    {dayjs(record.updatedAt).format('LLLL')}
                  </Space>
                )}
              />
              <Table.Column
                title="Created On"
                dataIndex="createdAt"
                key="createdAt"
                render={(_: any, record: { createdAt: string }) => (
                  <Space size="middle">
                    {dayjs(record.createdAt).format('LLLL')}
                  </Space>
                )}
              />
              <Table.Column
                title="Created By"
                key="createdBy"
                render={(_: any, record: { createdBy: Types.User }) => (
                  <Space size="middle">
                    {record.createdBy.name}
                    {/* <DeleteOutlined /> */}
                  </Space>
                )}
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Instructor) => (
                  <Space size="middle">
                    <EditOutlined
                      onClick={() =>
                        window.open(
                          `AssetLibrary/${record._id}/editor`,
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

export default AssetLibraryScreen
