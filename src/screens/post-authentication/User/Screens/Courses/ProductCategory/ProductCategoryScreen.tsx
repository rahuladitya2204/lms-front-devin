import { Button, Card, Col, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import CreateCategory from './CreateCategory'
import Header from '@Components/Header'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface ProductCategoryScreenPropsI {
  type: string;
}

function ProductCategoryScreen(props: ProductCategoryScreenPropsI) {
  const { data, isFetching: loading } = User.Queries.useGetProductCategories(
    props.type
  )

  return (
    <Header>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Categories'}
        extra={
          <ActionModal
            cta={<Button type="primary">Create New Category</Button>}
          >
            <CreateCategory> </CreateCategory>
          </ActionModal>
        }
      >
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading}>
              <Table.Column
                title="Course Title"
                dataIndex="title"
                key="title"
              />
              <Table.Column
                title="Description"
                dataIndex="description"
                key="description"
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.ProductCategory) => (
                  <Space size="middle">
                    <ActionModal cta={<EditOutlined />}>
                      <CreateCategory data={record} />
                    </ActionModal>

                    {/* <DeleteOutlined /> */}
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

export default ProductCategoryScreen
