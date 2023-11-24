import { Button, Col, Form, Input, Radio, Row, Select, Space } from 'antd'

interface PriceFormItemPropsI {
  name: string;
  label?: string;
}

function PriceFormItem(props: PriceFormItemPropsI) {
  return (
    <Form.Item label={props.label}>
      <Row style={{ display: 'flex', alignItems: 'start' }}>
        <Col>
          <Form.Item name={[props.name, 'unit']}>
            <Select style={{ width: 51 }}>
              <Select.Option value="INR">₹</Select.Option>
              <Select.Option value="dollar">$</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col flex={1}>
          <Form.Item name={[props.name, 'value']} style={{ paddingLeft: 8 }}>
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  )
}

export default PriceFormItem
