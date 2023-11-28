import { Button, Col, Form, Row, Select, Spin } from 'antd'

import ActionModal from './ActionModal/ActionModal'
import CreateCategory from '@User/Screens/Categories/CreateCategory'
import { PlusOutlined } from '@ant-design/icons'
import { User } from '@adewaskar/lms-common'

interface SelectProductCategoryPropsI {
  name: string | string[];
  placeholder?: string;
  label?: string;
}

export default function SelectProductCategory(
  props: SelectProductCategoryPropsI
) {
  const {
    listItems: categories,
    isLoading: loadingCategories
  } = User.Queries.useGetProductCategories('all')
  return (
    <Row gutter={[0, 20]} justify={'end'}>
      <Col flex={1}>
        <Spin spinning={loadingCategories}>
          <Form.Item
            name={props.name}
            required
            label={props.label || 'Category'}
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            {/* <Spin spinning={loadingCategories}> */}
            <Select
              style={{ width: '100%' }}
              placeholder={props.placeholder || 'Select Category'}
            >
              {categories.map(category => {
                return (
                  <Select.Option
                    key={category.value}
                    value={category.value}
                    label={category.label}
                  >
                    {category.label}
                  </Select.Option>
                )
              })}
            </Select>
            {/* </Spin> */}
          </Form.Item>
        </Spin>
      </Col>
      <Col style={{ display: 'flex', alignItems: 'center' }}>
        <ActionModal
          cta={
            <Button
              style={{ marginLeft: 10 }}
              shape="round"
              icon={<PlusOutlined />}
            />
          }
        >
          <CreateCategory> </CreateCategory>
        </ActionModal>
      </Col>
    </Row>
  )
}
