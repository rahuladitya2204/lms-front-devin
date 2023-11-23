import { Button, Card, Col, Form, List, Row, Typography } from 'antd'
import { Learner, Utils } from '@adewaskar/lms-common'
import { PhoneTwoTone, PlusOutlined, WalletTwoTone } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddMoneyToWallet from './AddMoneyToWallet'
import { OrderStatusTag } from './OrderStatusTag'
import dayjs from 'dayjs'

const { Title, Text } = Typography

interface LearnerWalletPropsI {}

export default function LearnerWallet() {
  const { data: orders } = Learner.Queries.useGetOrders()
  const { data: { wallet } } = Learner.Queries.useGetLearnerDetails()
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Card
          extra={
            <ActionModal
              width={200}
              cta={<Button icon={<PlusOutlined />}>Add Money</Button>}
            >
              <AddMoneyToWallet />
            </ActionModal>
          }
          title={<Title level={3}>Wallet Balance </Title>}
          // hoverable
        >
          <Title>
            {wallet.balance.value} {wallet.balance.unit}
          </Title>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="Transactions">
          <List
            dataSource={orders}
            renderItem={order => {
              const isWalletTopup =
                order.transaction.type === 'wallet' &&
                order.transaction.action === 'buy'
              return (
                <List.Item
                  actions={[
                    <OrderStatusTag status={order.status} />,
                    <Text strong>
                      {order.transaction.action === 'credit' ? '+' : '-'}{' '}
                      {Utils.UnitTypeToStr(order.total)}
                    </Text>
                  ]}
                  key={order._id}
                >
                  <List.Item.Meta
                    avatar={
                      order.transaction.type === 'wallet' ? (
                        <WalletTwoTone />
                      ) : (
                        <PhoneTwoTone />
                      )
                    }
                    title={order.transaction.description}
                    description={dayjs(order.completedAt).format('LL')}
                  />
                </List.Item>
              )
            }}
          />
        </Card>
      </Col>
    </Row>
  )
}
