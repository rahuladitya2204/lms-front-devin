import { Button, Col, Form, Input, Radio, Row, Select, Space } from 'antd'

interface PriceFormItemPropsI {
  name: string;
  label?: string;
}

function PriceFormItem(props: PriceFormItemPropsI) {
  return (
    <Row style={{ display: 'flex', alignItems: 'center' }}>
      <Col>
        <Form.Item label={props.label} name={[props.name, 'unit']}>
          <Select style={{ width: 51 }} defaultValue="rupee">
            <Select.Option value="rupee">₹</Select.Option>
            <Select.Option value="dollar">$</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Col flex={1}>
        <Form.Item
          name={[props.name, 'value']}
          style={{ paddingLeft: 8, marginTop: 30 }}
        >
          <Input type="number" />
        </Form.Item>
      </Col>
    </Row>
  )
}

export default PriceFormItem
