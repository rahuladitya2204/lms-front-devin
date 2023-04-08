import { Button, Card, Col, Row, Space, Table } from 'antd'
import { Common, Types } from '@adewaskar/lms-common'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import Header from '@Components/Header'
import { User } from '@adewaskar/lms-common'

function AssetLibraryScreen() {
  const { data, isLoading: loading } = Common.Queries.useGetFiles()

  return (
    <Header>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'AssetLibrary'}
        // extra={
        //   <ActionModal cta={<Button type="primary">Add Instructor</Button>}>
        //     <AddInstructor> </AddInstructor>
        //   </ActionModal>
        // }
      >
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading}>
              <Table.Column title="Name" dataIndex="name" key="name" />
              <Table.Column
                title="Modified On"
                dataIndex="updatedAt"
                key="updatedAt"
              />
              <Table.Column
                title="Created On"
                dataIndex="createdAt"
                key="createdAt"
              />
              <Table.Column
                title="Created By"
                key="createdBy"
                render={(_: any, record: Types.Instructor) => (
                  <Space size="middle">
                    {/* {record.createdAt} */}
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
