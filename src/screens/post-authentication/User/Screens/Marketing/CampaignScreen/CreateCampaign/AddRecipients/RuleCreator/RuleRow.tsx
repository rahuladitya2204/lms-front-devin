import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space
} from 'antd'

import { DeleteOutlined } from '@ant-design/icons'
import { Types } from '@invinciblezealorg/lms-common'
import dayjs from 'dayjs'

export const OPERATORS = {
  //   startsWith: {
  //     title: 'starts with',
  //     value: '$regex'
  //   },
  is: {
    title: 'is',
    value: '$eq'
  },
  contains: {
    title: 'contains',
    value: '$regex'
  },
  isAnyOf: {
    title: 'is any of',
    value: '$in'
  },
  isNot: {
    title: 'is not',
    value: '$neq'
  },
  isLessThan: {
    title: 'is less than',
    value: '$lt'
  },
  isGreaterThan: {
    title: 'is greater than',
    value: '$gt'
  }
}

export const OPERANDS = [
  {
    title: 'Enrolled Course',
    value: 'enrolledProducts.course',
    operators: [OPERATORS.is, OPERATORS.isAnyOf],
    type: 'select',
    query: {
      collection: 'courses'
    }
  },
  {
    title: 'Enrolled Test',
    value: 'enrolledProducts.test',
    operators: [OPERATORS.is, OPERATORS.isAnyOf],
    type: 'select',
    query: {
      collection: 'tests'
    }
  },
  {
    title: 'Enrolled At',
    value: 'enrolledProducts.enrolledAt',
    operators: [OPERATORS.isGreaterThan, OPERATORS.isLessThan],
    type: 'date'
  },
  {
    title: 'Expires At',
    value: 'enrolledProducts.expiresAt',
    operators: [OPERATORS.isGreaterThan, OPERATORS.isLessThan],
    type: 'date'
  },
  {
    title: 'Certificate Issued At',
    value: 'enrolledProducts.certificate.issuedAt',
    operators: [OPERATORS.isGreaterThan, OPERATORS.isLessThan],
    type: 'date'
  },
  {
    title: 'Email Address',
    value: 'email',
    operators: [OPERATORS.is, OPERATORS.contains],
    type: 'text'
  },
  {
    title: 'Language',
    value: 'language',
    operators: [OPERATORS.is, OPERATORS.contains],
    values: ['english', 'hindi'],
    type: 'text'
  },
  {
    title: 'Phone Number',
    operators: [OPERATORS.is, OPERATORS.contains],
    value: 'contactNo',
    type: 'text'
  },
  {
    title: 'State',
    operators: [OPERATORS.is, OPERATORS.contains],
    value: 'address.state',
    type: 'text'
  },
  {
    title: 'City',
    operators: [OPERATORS.is, OPERATORS.contains],
    value: 'address.city',
    type: 'text'
  },
  {
    title: 'Country',
    operators: [OPERATORS.is, OPERATORS.contains],
    value: 'address.country',
    type: 'text'
  },
  {
    title: 'Name',
    operators: [OPERATORS.is, OPERATORS.contains],
    value: 'name',
    type: 'text'
  },
  {
    title: 'Last Active',
    operators: [OPERATORS.isGreaterThan, OPERATORS.isLessThan],
    value: 'lastActive',
    type: 'date'
  }
]

interface RuleRowPropsI {
  isFirst: boolean;
  remove: Function;
  name: number;
  // updateRule: (type: string, val: string) => void;
}

function RuleRow(props: RuleRowPropsI) {
  const form = Form.useFormInstance()
  const rule = Form.useWatch(['recipients', 'rules', props.name], form) || {
    operand: '',
    operator: '',
    value: ''
  }
  const operand = Form.useWatch(
    ['recipients', 'rules', props.name, 'operand'],
    form
  )
  // console.log(operand, 'huhhaha')
  const OPERAND = OPERANDS.find(o => o.value === rule.operand)
  // console.log(rule, 'rule', OPERANDS)
  return (
    <Row>
      <Col span={24}>
        <Space direction="horizontal" style={{ marginBottom: 10 }}>
          {/* <span>{props.name}</span> */}
          <Form.Item
            name={[props.name, 'operand']}
            rules={[
              {
                required: true,
                message: 'Please enter an operand'
              }
            ]}
          >
            <Select
              style={{ width: 250, marginRight: 20 }}
              options={OPERANDS.map(o => {
                return {
                  label: o.title,
                  value: o.value
                }
              })}
            />
          </Form.Item>
          <Form.Item
            name={[props.name, 'operator']}
            rules={[
              {
                required: true,
                message: 'Please enter an operator'
              }
            ]}
          >
            <Select
              // value={props.rule.operator}
              style={{ width: 200, marginRight: 20 }}
              placeholder="Select Operator"
              // onChange={e => props.updateRule('operator', e)}
              options={OPERAND?.operators?.map(o => {
                return {
                  label: o.title,
                  value: o.value
                }
              })}
            />
          </Form.Item>
          <Form.Item
            name={[props.name, 'value']}
            rules={[
              {
                required: true,
                message: 'Please input a value'
              }
            ]}
          >
            {OPERAND?.type === 'text' ? (
              <Input
                style={{ width: 200 }}
                // onChange={e => props.updateRule('value', e.target.value)}
                // value={props.rule.value}
              />
            ) : null}

            {OPERAND?.type === 'date' ? (
              <DatePicker
                style={{ width: 200 }}
                // onChange={e => props.updateRule('value', e?.toISOString() + '')}
                // value={props.rule.value ? dayjs(props.rule.value) : null}
              />
            ) : null}
            {OPERAND?.type === 'select' ? (
              <Select
                style={{ width: 200 }}
                //   onChange={e => props.updateRule('value', e)}
                //   value={props.rule.value}
              />
            ) : null}
          </Form.Item>
          {!props.isFirst ? (
            <Button
              style={{ marginBottom: 24 }}
              onClick={() => props.remove()}
              icon={<DeleteOutlined size={10} />}
            />
          ) : null}
        </Space>
      </Col>
    </Row>
  )
}

export default RuleRow
