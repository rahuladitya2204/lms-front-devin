import { Alert, Typography } from 'antd'
import { Learner, Store, Types, Utils } from '@adewaskar/lms-common'

import { WalletTwoTone } from '@ant-design/icons'

interface ProductWalletNudgePropsI {
  product: Types.Product;
}

const { Text } = Typography
export default function ProductWalletNudge(props: ProductWalletNudgePropsI) {
  const isEnrolled = Learner.Queries.useIsLearnerEnrolledToProduct(
    props.product
  )
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn)
  const { data: { wallet } } = Learner.Queries.useGetLearnerDetails()
  if (!(isSignedIn && wallet.balance.value > 0 && !isEnrolled)) {
    return null
  }
  return (
    <Alert
      style={{ marginBottom: 10 }}
      showIcon
      icon={<WalletTwoTone />}
      type="success"
      message={
        <Text style={{ fontSize: 15 }}>
          Use your {Utils.UnitTypeToStr(wallet.balance)} wallet balance to buy
          this now!
        </Text>
      }
    />
  )
}
