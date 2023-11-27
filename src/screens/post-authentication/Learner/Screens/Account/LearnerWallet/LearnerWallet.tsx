import { Button, Card, Col, Form, List, Row, Spin, Typography } from 'antd'
import {
  CheckCircleTwoTone,
  PhoneTwoTone,
  PlusOutlined,
  WalletTwoTone
} from '@ant-design/icons'
import { Learner, Utils } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddMoneyToWallet from './AddMoneyToWallet'
import { OrderStatusTag } from './OrderStatusTag'
import dayjs from 'dayjs'
import useBreakpoint from '@Hooks/useBreakpoint'

const { Title, Text } = Typography

interface LearnerWalletPropsI {}

export default function LearnerWallet() {
  const {
    data: orders,
    isLoading: loadingOrders
  } = Learner.Queries.useGetOrders()
  const {
    data: { wallet },
    isLoading: loadingWalletDetails
  } = Learner.Queries.useGetLearnerDetails()
  const { isMobile } = useBreakpoint()

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} md={12}>
        <Spin spinning={loadingWalletDetails}>
          <Card
            extra={
              <ActionModal
                width={250}
                cta={
                  <Button type="primary" icon={<PlusOutlined />}>
                    {!isMobile ? 'Add Money' : ''}
                  </Button>
                }
              >
                <AddMoneyToWallet />
              </ActionModal>
            }
            title={
              <Title style={{ margin: 0 }} level={4}>
                Wallet Balance{' '}
              </Title>
            }
            // hoverable
          >
            <Title>{Utils.UnitTypeToStr(wallet.balance)}</Title>
          </Card>
        </Spin>
      </Col>
      <Col xs={0} sm={24} md={12}>
        <Card title="Transactions">
          <List
            loading={loadingOrders}
            dataSource={orders}
            renderItem={order => {
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
                        <CheckCircleTwoTone />
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
