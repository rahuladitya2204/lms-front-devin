import { Button, Col, Form, Row, Select, Typography } from 'antd'

import { DeleteOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd/lib'
import { User } from '@adewaskar/lms-common'
import { useMemo } from 'react'

const PRODUCT_TYPES = [
  { label: 'Test', value: 'test' },
  { label: 'Course', value: 'course' },
  { label: 'Event', value: 'event' }
]

interface ProductFormRowProps {
  form: FormInstance; // Form instance passed from the parent component
  name: number; // Index of the form list
  remove: (index: number) => void; // Function to remove a row
}

const ProductRow: React.FC<ProductFormRowProps> = ({ name, remove, form }) => {
  const { data: courses } = User.Queries.useGetCourses()
  const { data: tests } = User.Queries.useGetTests()
  const { data: events } = User.Queries.useGetEvents()

  // Use useWatch to track changes of product type
  const productType = Form.useWatch({
    name: ['products', name, 'type']
    // control: form.control // Pass the control prop from form instance
  })

  const productOptions = useMemo(
    () => {
      switch (productType) {
        case 'course':
          return courses?.map(course => ({
            label: course.title,
            value: course._id
          }))
        case 'test':
          return tests?.map(test => ({ label: test.title, value: test._id }))
        case 'event':
          return events?.map(event => ({
            label: event.title,
            value: event._id
          }))
        default:
          return []
      }
    },
    [productType, courses, tests, events]
  )
  console.log(productType, 'type')
  return (
    <Row gutter={[20, 20]} align="middle" style={{ marginBottom: 20 }}>
      <Col>
        <Form.Item name={[name, 'type']} noStyle>
          <Select options={PRODUCT_TYPES} style={{ width: 120 }} />
        </Form.Item>
      </Col>
      <Col flex={1}>
        <Form.Item name={[name, 'id']} noStyle>
          <Select
            style={{ width: '100%' }}
            mode="multiple"
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
