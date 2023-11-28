import { Button, Card, Col, Empty, Row, Spin, Typography } from 'antd'
import { Enum, Learner, Types, User } from '@adewaskar/lms-common'
import { useMemo, useState } from 'react'

import AppImage from '@Components/Image'
import { CheckOutlined } from '@ant-design/icons'
import Tabs from '@Components/Tabs'
import { copyToClipboard } from '@Utils/index'

const { Text } = Typography
interface ProductCardPropsI {
  product: Types.Product;
  children?: React.ReactNode;
  actions?: React.ReactNode[];
}

const ProductCard = (props: ProductCardPropsI) => {
  const { product: { type, id } } = props
  // console.log(type,)
  const { data: products } = User.Queries.useGetProductList(type)

  console.log('123', products)
  const product =
    // @ts-ignore
    products?.find(o => o._id === id) || {}
  return (
    <Card
      hoverable
      bodyStyle={{ padding: '20px 10px' }}
      cover={
        <AppImage height={80} alt="example" src={product.thumbnailImage} />
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

export default ProductCard
