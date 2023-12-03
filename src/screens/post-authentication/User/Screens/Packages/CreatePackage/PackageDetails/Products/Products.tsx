import {
  Button,
  Card,
  Col,
  Collapse,
  Form,
  FormListFieldData,
  Row,
  Select,
  Space,
  Table
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Enum, Types, User } from '@adewaskar/lms-common'
import { Fragment, useCallback } from 'react'

import ProductCard from '@Components/UserProductCard'
import SearchUserProducts from '@Components/SearchUserProducts'
import { capitalize } from 'lodash'

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
  return (
    <Fragment>
      <Collapse
        collapsible="header"
        defaultActiveKey={['1']}
        items={PRODUCT_TYPES.map(product => {
          const name = product.value
          return {
            key: name,
            label: capitalize(name),
            children: (
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <Form.List name={['products', name]}>
                    {(fields, { add, remove }) => {
                      return (
                        <ProductSection
                          add={add}
                          remove={remove}
                          fields={fields}
                          productType={product.value}
                          name={name}
                        />
                      )
                    }}
                  </Form.List>
                </Col>
              </Row>
            )
          }
        })}
      />
    </Fragment>
  )
}

interface ProductSectionPropsI {
  productType: Enum.ProductType;
  fields: FormListFieldData[];
  add: any;
  remove: any;
  name: string;
}

export const ProductSection = (props: ProductSectionPropsI) => {
  const form = Form.useFormInstance()
  return (
    <Fragment>
      <Row>
        <Col span={24}>
          <SearchUserProducts
            // @ts-ignore
            onSelect={e => props.add(e)}
            type={props.productType}
          />
        </Col>
        <Col span={24}>
          <Row gutter={[20, 30]}>
            {props.fields.map((field, index) => {
              const fieldValue = form.getFieldValue([
                'products',
                props.name,
                field.name
              ])
              console.log(fieldValue, 'fieldValue')
              return (
                <Col span={4}>
                  <ProductCard
                    // type={product.value}
                    product={{
                      type: props.productType,
                      id: fieldValue
                    }}
                    actions={[
                      <Button
                        size="small"
                        onClick={() => props.remove(index)}
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
        </Col>
      </Row>
    </Fragment>
  )
}
