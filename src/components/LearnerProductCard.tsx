import { Button, Card, Col, Empty, Row, Spin, Typography } from 'antd'
import { Enum, Learner, Types, User } from '@adewaskar/lms-common'

import AppImage from '@Components/Image'

const { Text } = Typography
interface LearnerProductCardPropsI {
  product: Types.Product;
  children?: React.ReactNode;
  actions?: React.ReactNode[];
  onClick?: Function;
}

const LearnerProductCard = (props: LearnerProductCardPropsI) => {
  const { product: { type, id } } = props
  const { data: product } = Learner.Queries.useGetProductDetail({ type, id })
  console.log(type, id, '1321')

  return (
    <Card
      onClick={() => props.onClick && props.onClick()}
      hoverable
      bodyStyle={{ padding: '20px 10px' }}
      cover={
        <AppImage height={120} alt="example" src={product.thumbnailImage} />
      }
      actions={props.actions}
    >
      <Card.Meta
        description={props.children}
        title={<Text>{product.title}</Text>}
      />
    </Card>
  )
}

export default LearnerProductCard
