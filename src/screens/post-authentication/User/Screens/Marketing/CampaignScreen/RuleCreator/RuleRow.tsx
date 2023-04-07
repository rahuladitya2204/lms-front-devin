import { Button, Card, Col, Form, Input, Row, Select, Space } from 'antd'

import { DeleteOutlined } from '@ant-design/icons'
import { Types } from '@adewaskar/lms-common'

const OPERATORS = {
  startsWith: {
    title: 'starts with',
    value: '$regex'
  },
  is: {
    title: 'is',
    value: '$eq'
  },
  contains: {
    title: 'is',
    value: '$contains'
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

const OPERANDS = [
  {
    title: 'Enrolled Courses',
    value: 'enrolledCourses.course',
    operators: [OPERATORS.is, OPERATORS.isAnyOf],
    query: {
      collection: 'Course'
    }
  },
  {
    title: 'Email Address',
    value: 'email',
    operators: [OPERATORS.is, OPERATORS.startsWith, OPERATORS.contains]
  },
  {
    title: 'Language',
    value: 'language',
    operators: [OPERATORS.is, OPERATORS.startsWith, OPERATORS.contains],
    values: ['english', 'hindi']
  },
  {
    title: 'Phone Number',
    operators: [OPERATORS.is, OPERATORS.startsWith, OPERATORS.contains],
    value: 'contactNo'
  }
]

interface RuleRowPropsI {
  rule: Types.Rule;
  deleteRule: Function;
  updateRule: (type: string, val: string) => void;
}

function RuleRow(props: RuleRowPropsI) {
  const OPERAND = OPERANDS.find(o => o.value == props.rule.operand)
  return (
    <Row>
      <Col span={24}>
        <Space direction="horizontal">
          <Select
            value={props.rule.operand}
            style={{ width: 200 }}
            onChange={e => props.updateRule('operand', e)}
            options={OPERANDS.map(o => {
              return {
                label: o.title,
                value: o.value
              }
            })}
          />
          <Select
            value={props.rule.operator}
            style={{ width: 120 }}
            placeholder="Select Operator"
            onChange={e => props.updateRule('operator', e)}
            options={OPERAND?.operators?.map(o => {
              return {
                label: o.title,
                value: o.value
              }
            })}
          />
          <Input
            onChange={e => props.updateRule('value', e.target.value)}
            value={props.rule.value}
          />
          <Button
            onClick={() => props.deleteRule()}
            icon={<DeleteOutlined size={10} />}
          />
        </Space>
      </Col>
    </Row>
  )
}

export default RuleRow
