import { Button, Card, Col, Form, Row, Select, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Enum, Types, User } from '@adewaskar/lms-common'
import { Fragment, useCallback } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddProduct from './AddProduct'
import Image from '@Components/Image'
import MoreButton from '@Components/MoreButton'
import ProductCard from '@Components/ProductCard'
import ProductRow from './ProductRow'

const PRODUCT_TYPES = [
  { title: 'Test', value: Enum.ProductType.TEST },
  { title: 'Events', value: Enum.ProductType.EVENT },
  { title: 'Courses', value: Enum.ProductType.COURSE }
]
interface ProductsProps {
  // products: Types.Product[];
  // deleteItem: (index: number) => void;
  // submit: (index: number, d: { type: string, data: any }) => void;
}

export default function Products({  }: ProductsProps) {
  const { data: courses } = User.Queries.useGetCourses()
  const { data: tests } = User.Queries.useGetTests()
  const { data: events } = User.Queries.useGetEvents()
  const form = Form.useFormInstance()
  const getOptions = useCallback(
    (type: Enum.ProductType) => {
      switch (type) {
        case Enum.ProductType.COURSE:
          return courses?.map(course => ({
            label: course.title,
            value: course._id
          }))
        case Enum.ProductType.TEST:
          return tests?.map(test => ({
            label: test.title,
            value: test._id
          }))
        case Enum.ProductType.EVENT:
          return events?.map(event => ({
            label: event.title,
            value: event._id
          }))
        default:
          return []
      }
    },
    [courses, tests, events]
  )
  return (
    <Fragment>
      {PRODUCT_TYPES.map(product => {
        const name = product.value + 's'
        return (
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Form.List name={['products', name]}>
                {(fields, { add, remove }) => {
                  return (
                    <Card
                      style={{ marginBottom: 30 }}
                      title={product.title}
                      extra={
                        <Select
                          placeholder="Select to add"
                          style={{ width: 200 }}
                          onSelect={e => add(e)}
                          options={getOptions(product.value)}
                        />
                      }
                    >
                      <Row gutter={[20, 30]}>
                        {fields.map((field, index) => {
                          const fieldValue = form.getFieldValue([
                            'products',
                            name,
                            field.name
                          ])
                          console.log(fieldValue, 'fieldValue')
                          return (
                            <Col span={4}>
                              <ProductCard
                                // type={product.value}
                                product={{
                                  type: product.value,
                                  id: fieldValue
                                }}
                                actions={[
                                  <Button
                                    size="small"
                                    onClick={() => remove(index)}
                                    icon={<DeleteOutlined />}
                                  >
                                    {/* Delete */}
                                  </Button>
                                ]}
                              />
                            </Col>
                          )
                        })}
                      </Row>
                      {/* <Row>
                          <Col span={24}>
                            <Button type="dashed" onClick={() => add()} block>
                              Add {product.title}
                            </Button>
                          </Col>
                        </Row> */}
                    </Card>
                  )
                }}
              </Form.List>
            </Col>
          </Row>
        )
      })}
    </Fragment>
  )
}
