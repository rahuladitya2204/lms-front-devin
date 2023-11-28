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

  const productOptions = useMemo(
    () => {
      switch (type) {
        case 'courses':
          return courses?.map(course => ({
            label: course.title,
            value: course._id
          }))
        case 'tests':
          return tests?.map(test => ({ label: test.title, value: test._id }))
        case 'events':
          return events?.map(event => ({
            label: event.title,
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
        <Form.Item name={name} noStyle>
          <Select
            style={{ width: '100%' }}
            // mode="multiple"
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
