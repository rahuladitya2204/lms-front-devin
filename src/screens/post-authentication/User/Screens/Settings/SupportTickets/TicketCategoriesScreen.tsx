import { Button, Card, Col, Row, Space, Spin, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal/ActionModal'
import CreateTicketCategory from './CreateTicketCategory'
// import Header from '@Components/Header'
import { Types } from '@invinciblezealorg/lms-common'
import { User } from '@invinciblezealorg/lms-common'
import dayjs from 'dayjs'

function TicketCategorysScreen() {
  const { data, isLoading: loading } = User.Queries.useGetTicketCategories()

  return (
    <Spin spinning={loading}>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Ticket Categories'}
        extra={
          <ActionModal
            title="Create New Category"
            cta={<Button type="primary">Create New Category</Button>}
          >
            <CreateTicketCategory> </CreateTicketCategory>
          </ActionModal>
        }
      >
        <Row>
          <Col span={24}>
            <Table
              dataSource={data}
              loading={loading}
              // expandable={{
              //   expandedRowRender: record => (
              //     <p style={{ margin: 0 }}>{record.description}</p>
              //   ),
              //   rowExpandable: record => record.name !== 'Not Expandable'
              // }}
            >
              <Table.Column title="Title" dataIndex="title" key="title" />
              {/* <Table.Column title="Courses" dataIndex="courses" key="courses" /> */}
              {/* <Table.Column title="Rating" dataIndex="rating" key="rating" /> */}
              <Table.Column
                title="Type"
                key="type"
                render={(_: any, record: Types.TicketCategory) => (
                  <Space size="middle">
                    {record.parentCategory ? 'Sub Category' : 'Category'}
                  </Space>
                )}
              />
              {/* <Table.Column
              title="Created At"
              dataIndex="createdAt"
              key="createdAt"
              render={(_: any, record: Types.TicketCategory) => (
                <Space size="middle">
                  {dayjs(record.createdAt)}
                </Space>
              )}
            /> */}
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.TicketCategory) => (
                  <Space size="middle">
                    <ActionModal cta={<EditOutlined />}>
                      <CreateTicketCategory data={record} />
                    </ActionModal>
                    <DeleteOutlined />
                  </Space>
                )}
              />
            </Table>
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}

export default TicketCategorysScreen
