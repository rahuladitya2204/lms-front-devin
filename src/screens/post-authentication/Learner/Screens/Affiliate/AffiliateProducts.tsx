import { Button, Card, Col, Empty, Row, Spin } from 'antd'
import { Enum, Learner, Types } from '@invinciblezealorg/lms-common'

import AppImage from '@Components/Image'
import { CheckOutlined } from '@ant-design/icons'
import Tabs from '@Components/Tabs'
import { Typography } from '@Components/Typography'
import { copyToClipboard } from '@Utils/index'
import { useState } from 'react'

const { Text } = Typography
export default function AffiliateProducts() {
  const tabs = []
  tabs.push(
    {
      label: 'Tests',
      key: 'tests',
      children: <ProductList type="test" />
    },
    {
      label: 'Events',
      key: 'events',
      children: <ProductList type="event" />
    },
    {
      label: 'Courses',
      key: 'courses',
      children: <ProductList type="course" />
    }
  )

  return <Tabs type="card" items={tabs} />
}

interface ProductCardPropsI {
  product: Types.ProductItem;
  type: string;
}

export const ProductCard = (props: ProductCardPropsI) => {
  const [copy, setCopy] = useState(false)
  const { product } = props
  const {
    data: affiliateDetails
  } = Learner.Queries.useGetAffiliateAccountDetails()
  //   @ts-ignore
  const url = `${window.location.host}/app/${props.type}/${product._id}?ref=${
    // @ts-ignore
    affiliateDetails._id
  }`
  const generateLink = () => {
    setCopy(true)
    setTimeout(() => setCopy(false), 5000)
    copyToClipboard(url)
  }
  return (
    <Card
      bodyStyle={{ padding: '20px 10px' }}
      cover={
        <AppImage height={80} alt="example" src={product.thumbnailImage} />
      }
    >
      <Card.Meta
        description={
          <Button
            type={copy ? 'primary' : 'default'}
            block
            icon={copy ? <CheckOutlined /> : null}
            onClick={generateLink}
            size="small"
          >
            {copy ? 'Link Copied' : 'Copy Link'}
          </Button>
        }
        title={<Text>{product.title}</Text>}
      />
    </Card>
  )
}

export const ProductList = (props: {
  //   products: Types.ProductItem[],
  type: string
}) => {
  const {
    data: products,
    isLoading: loadingProducts
  } = Learner.Queries.useGetProducts(props.type)

  return (
    <Spin spinning={loadingProducts}>
      {!loadingProducts && products.length === 0 ? (
        <Empty />
      ) : (
        <Row gutter={[20, 30]}>
          {products.map(product => (
            <Col xs={24} sm={12} md={6} lg={4}>
              <ProductCard type={props.type} product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Spin>
  )
}
