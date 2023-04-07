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
import { Types } from '@adewaskar/lms-common'
import dayjs from 'dayjs'

const OPERATORS = {
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

const OPERANDS = [
  {
    title: 'Enrolled Courses',
    value: 'enrolledCourses.course',
    operators: [OPERATORS.is, OPERATORS.isAnyOf],
    query: {
      collection: 'Course'
    },
    type: 'select'
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
  rule: Types.Rule;
  deleteRule: Function;
  updateRule: (type: string, val: string) => void;
}

function RuleRow(props: RuleRowPropsI) {
  const OPERAND = OPERANDS.find(o => o.value == props.rule.operand)
  return (
    <Row>
      <Col span={24}>
        <Space direction="horizontal" style={{ marginBottom: 10 }}>
          <Select
            value={props.rule.operand}
            style={{ width: 250, marginRight: 20 }}
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
            style={{ width: 200, marginRight: 20 }}
            placeholder="Select Operator"
            onChange={e => props.updateRule('operator', e)}
            options={OPERAND?.operators?.map(o => {
              return {
                label: o.title,
                value: o.value
              }
            })}
          />
          {OPERAND?.type === 'text' ? (
            <Input
              style={{ width: 200 }}
              onChange={e => props.updateRule('value', e.target.value)}
              value={props.rule.value}
            />
          ) : null}

          {OPERAND?.type === 'date' ? (
            <DatePicker
              style={{ width: 200 }}
              onChange={e => props.updateRule('value', e?.toISOString() + '')}
              value={props.rule.value ? dayjs(props.rule.value) : null}
            />
          ) : null}
          {OPERAND?.type === 'select' ? (
            <Select
              style={{ width: 200 }}
              //   onChange={e => props.updateRule('value', e)}
              //   value={props.rule.value}
            />
          ) : null}
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
