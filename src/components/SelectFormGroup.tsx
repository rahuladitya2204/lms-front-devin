import { Button, Col, Form, Input, Radio, Row, Select, Space } from 'antd'

import { DefaultOptionType } from 'antd/es/select'
import { useEffect } from 'react'

interface SelectFormGroupPropsI {
  name: string | string[];
  prefixName?: string | string[];
  value?: string;
  prefixValue?: string;
  prefixValues?: DefaultOptionType[];
  label?: string;
}

function SelectFormGroup(props: SelectFormGroupPropsI) {
  const form = Form.useFormInstance()
  useEffect(
    () => {
      form.setFieldValue(props.prefixName, props.prefixValue)
    },
    [props.prefixValue]
  )
  useEffect(
    () => {
      form.setFieldValue(props.name, props.value)
    },
    [props.value]
  )
  return (
    <Form.Item label={props.label}>
      <Row style={{ display: 'flex', alignItems: 'start' }}>
        {props.prefixValues ? (
          <Col>
            <Form.Item name={props.prefixName}>
              <Select
                showSearch
                options={props.prefixValues}
                style={{ width: 80 }}
              />
            </Form.Item>
          </Col>
        ) : null}
        <Col flex={1}>
          <Form.Item name={props.name} style={{ paddingLeft: 8 }}>
            <Input type="number" />
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
  )
}

export default SelectFormGroup
