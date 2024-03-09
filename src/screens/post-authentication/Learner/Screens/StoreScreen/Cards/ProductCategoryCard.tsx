import { Avatar, Badge, Card, Col, Divider, Rate, Row, Space, Tag } from 'antd'
import {
  BarChartOutlined,
  BookOutlined,
  ClockCircleOutlined,
  EditOutlined,
  RightOutlined
} from '@ant-design/icons'
import { Constants, Enum, Types } from '@adewaskar/lms-common'

import Image from '@Components/Image'
import PriceCardContent from './PriceCardContent'
import { Typography } from '@Components/Typography'
import { Utils } from '@adewaskar/lms-common'
import { capitalize } from 'lodash'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

const { UnitTypeToStr } = Utils

interface ProductCategoryCardPropsI {
  productCategory: Types.ProductCategory;
}

const CustomCard = styled(Card)`
  cursor: pointer;
  /* margin-left: 30px;
margin-bottom: 20px; */
`

function ProductCategoryCard(props: ProductCategoryCardPropsI) {
  const { productCategory } = props
  const navigate = useNavigate()
  return (
    <Card
      onClick={() => navigate(`../category/${productCategory._id}`)}
      hoverable
      style={{ display: 'flex', alignItems: 'center' }}
      bodyStyle={{ padding: 0, width: '100%' }}
    >
      <Row gutter={[20, 20]} justify={'space-between'} align={'middle'}>
        <Col>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt="example"
              src={productCategory.thumbnailImage}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                objectFit: 'cover',
                margin: '10px'
              }}
            />
            <p style={{ margin: 0, paddingLeft: '10px', fontWeight: 'bold' }}>
              {productCategory.title}
            </p>
          </div>
        </Col>
        <Col style={{ marginRight: 10 }}>
          <RightOutlined />
        </Col>
      </Row>
    </Card>
  )
}

export default ProductCategoryCard
