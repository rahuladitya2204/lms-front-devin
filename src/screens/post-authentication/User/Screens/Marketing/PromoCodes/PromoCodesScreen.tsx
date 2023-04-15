import { Button, Card, Col, Row, Space, Table, Typography } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import AddPromoCode from './CreatePromoCode'
import CreatePromoCode from './CreatePromoCode'
import Header from '@Components/Header'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

const { Text } = Typography

function PromoCodesScreen() {
  const { data, isLoading: loading } = User.Queries.useGetPromoCodes()

  return (
    <Header>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'PromoCodes'}
        extra={
          <ActionModal cta={<Button type="primary">Add PromoCode</Button>}>
            <AddPromoCode> </AddPromoCode>
          </ActionModal>
        }
      >
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading}>
              <Table.Column title="Code" dataIndex="code" key="code" />
              <Table.Column
                title="Discount Percent"
                dataIndex="discountPercent"
                key="discountPercent"
                render={(_: any, record: Types.PromoCode) => (
                  <Space size="middle">
                    <Text>{record.discountPercent} %</Text>
                  </Space>
                )}
              />
              <Table.Column
                title="Start Date"
                dataIndex="startDate"
                key="startDate"
                render={(_: any, record: Types.PromoCode) => (
                  <Space size="middle">
                    {dayjs(record.startDate).format('LL')}
                  </Space>
                )}
              />
              <Table.Column
                title="End Date"
                dataIndex="endDate"
                key="endDate"
                render={(_: any, record: Types.PromoCode) => (
                  <Space size="middle">
                    {dayjs(record.endDate).format('LL')}
                  </Space>
                )}
              />
              <Table.Column
                title="Max Count"
                dataIndex="max.count"
                key="max.count"
                render={(_: any, record: Types.PromoCode) => (
                  <Space size="middle">
                    <Text>{record.max.count}</Text>
                  </Space>
                )}
              />
              <Table.Column
                title="Total Used"
                dataIndex="used.count"
                key="used.count"
                render={(_: any, record: Types.PromoCode) => (
                  <Space size="middle">
                    <Text>{record.used.count}</Text>
                  </Space>
                )}
              />

              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.PromoCode) => (
                  <Space size="middle">
                    <ActionModal cta={<EditOutlined />}>
                      <CreatePromoCode data={record} />
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

export default PromoCodesScreen
