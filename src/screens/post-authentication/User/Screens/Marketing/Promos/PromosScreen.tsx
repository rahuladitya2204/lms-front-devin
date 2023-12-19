import { Button, Card, Col, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddPromo from './CreatePromo'
import CreatePromo from './CreatePromo'
import Header from '@User/Screens/UserRoot/UserHeader'
import { Types } from '@adewaskar/lms-common'
import { Typography } from '@Components/Typography'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

const { Text } = Typography

function PromosScreen() {
  const { data, isFetching: loading } = User.Queries.useGetPromos()

  return (
    <Header
      title={'Promos'}
      extra={[
        <ActionModal cta={<Button type="primary">Create Promo Code</Button>}>
          <AddPromo> </AddPromo>
        </ActionModal>
      ]}
    >
      <Card bodyStyle={{ padding: 0 }}>
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading}>
              <Table.Column title="Code" dataIndex="code" key="code" />
              <Table.Column
                title="Discount Percent"
                dataIndex="discountPercent"
                key="discountPercent"
                render={(_: any, record: Types.Promo) => (
                  <Space size="middle">
                    <Text>{record.discountPercent} %</Text>
                  </Space>
                )}
              />
              <Table.Column
                title="Start Date"
                dataIndex="startDate"
                key="startDate"
                render={(_: any, record: Types.Promo) => (
                  <Space size="middle">
                    {dayjs(record.startDate).format('LL')}
                  </Space>
                )}
              />
              <Table.Column
                title="End Date"
                dataIndex="endDate"
                key="endDate"
                render={(_: any, record: Types.Promo) => (
                  <Space size="middle">
                    {dayjs(record.endDate).format('LL')}
                  </Space>
                )}
              />
              <Table.Column
                title="Max Count"
                dataIndex="max.count"
                key="max.count"
                render={(_: any, record: Types.Promo) => (
                  <Space size="middle">
                    <Text>{record.max.count}</Text>
                  </Space>
                )}
              />
              <Table.Column
                title="Total Used"
                dataIndex="used.count"
                key="used.count"
                render={(_: any, record: Types.Promo) => (
                  <Space size="middle">
                    <Text>{record.used.count}</Text>
                  </Space>
                )}
              />

              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Promo) => (
                  <Space size="middle">
                    <ActionModal cta={<EditOutlined />}>
                      <CreatePromo data={record} />
                    </ActionModal>
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

export default PromosScreen
