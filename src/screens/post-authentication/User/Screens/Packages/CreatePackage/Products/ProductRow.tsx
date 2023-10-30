import Image from '@Components/Image'
import MoreButton from '@Components/MoreButton'
import { Types, User } from '@adewaskar/lms-common'
import { DeleteOutlined } from '@ant-design/icons'
import { Space, Table, Typography } from 'antd'
import { useMemo } from 'react'

interface ProductRowPropsI {
  product: Types.Product;
}

const { Text } = Typography

export default function ProductRow(props: ProductRowPropsI) {
  const { product } = props
  const { data: courses } = User.Queries.useGetCourses()
  const { data: tests } = User.Queries.useGetTests()
  const { data: events } = User.Queries.useGetEvents()

  const matchedProduct = useMemo(
    () => {
      let result: any[] = []
      switch (product?.type) {
        case 'course':
          result = courses
          break
        case 'test':
          result = tests
          break
        case 'event':
          result = events
          break
        default:
          result = [] // or any default value you prefer
      }
      return result.find(p => p._id === product.id)
    },
    [product]
  )

  return (
    <Space>
      <Text>
        <Image width={30} height={30} src={matchedProduct?.thumbnailImage} />
      </Text>
      <Text> {matchedProduct?.title}</Text>
    </Space>
  )
}
