import { Button, Col, Form, Row, Select, Typography } from 'antd'
import { Types, User } from '@adewaskar/lms-common'

import AppImage from '@Components/Image'
import { DeleteOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib'
import { useMemo } from 'react'

const { Title } = Typography
interface ProductFormRowProps {
  type: string;
  form: FormInstance; // Form instance passed from the parent component
  name: number; // Index of the form list
  remove: (index: number) => void; // Function to remove a row
}

const ProductRow: React.FC<ProductFormRowProps> = ({
  name,
  remove,
  form,
  type
}) => {
  const { data: courses } = User.Queries.useGetCourses()
  const { data: tests } = User.Queries.useGetTests()
  const { data: events } = User.Queries.useGetEvents()
  const createOptionLabel = (product: Types.ProductItem) => {
    return (
      <Row align={'middle'} gutter={[20, 20]}>
        <Col span={2}>
          <AppImage src={product.thumbnailImage} />
        </Col>
        <Col span={22}>
          <Title level={3}>{product.title}</Title>
        </Col>
      </Row>
    )
  }
  const productOptions = useMemo(
    () => {
      switch (type) {
        case 'courses':
          return courses?.map(course => ({
            label: createOptionLabel(course),
            value: course._id
          }))
        case 'tests':
          return tests?.map(test => ({
            label: createOptionLabel(test),
            value: test._id
          }))
        case 'events':
          return events?.map(event => ({
            label: createOptionLabel(event),
            value: event._id
          }))
        default:
          return []
      }
    },
    [type, courses, tests, events]
  )
  // console.log(type, 'type')
  return (
    <Row gutter={[20, 20]} align="middle" style={{ marginBottom: 20 }}>
      <Col flex={1}>
        <Form.Item name={[name]} noStyle>
          <Select
            style={{ height: 60, width: '100%' }}
            // mode="multiple"
            // @ts-ignore
            options={productOptions}
          />
        </Form.Item>
      </Col>
      <Col>
        <Button
          icon={<DeleteOutlined />}
          type="link"
          onClick={() => remove(name)}
        />
      </Col>
    </Row>
  )
}

export default ProductRow
