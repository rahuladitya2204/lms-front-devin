import { Button, Card, Col, Form, Row, Typography } from 'antd'
import { PlusOutlined, WalletTwoTone } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddMoneyToWallet from './AddMoneyToWallet'
import { Learner } from '@adewaskar/lms-common'

const { Title } = Typography

interface LearnerWalletPropsI {}

export default function LearnerWallet() {
  const { data: { wallet } } = Learner.Queries.useGetLearnerDetails()
  return (
    <Row>
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
          title={<Title level={3} >Wallet Balance </Title>}
          hoverable
        >
          <Title>
            {wallet.balance.value} {wallet.balance.unit}
          </Title>
        </Card>
      </Col>
    </Row>
  )
}
