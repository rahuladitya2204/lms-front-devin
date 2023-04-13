import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Row,
  Select,
  Space,
  Table,
  Typography
} from 'antd'

import { FormInstance } from 'antd/lib/form/Form'
import { PlusOutlined } from '@ant-design/icons'
import RuleRow from './RuleRow'
import { Types } from '@adewaskar/lms-common'

interface RuleCreatorPropsI {
  addRule: Function;
  updateRule: Function;
  operator: string;
  setOperator: (s: string) => void;
  deleteRule: Function;
  rules: Types.Rule[];
}

function RuleCreator(props: RuleCreatorPropsI) {
  return (
    <Row>
      <Col span={24}>
        <Card
          title={
            <Typography.Text>
              Learners Match{' '}
              <Select
                size="small"
                value={props.operator}
                style={{ width: 70 }}
                onChange={e => props.setOperator(e)}
                options={[
                  {
                    label: 'any',
                    value: '$or'
                  },
                  {
                    label: 'and',
                    value: '$and'
                  }
                ]}
              />{' '}
              of the following conditions
            </Typography.Text>
          }
          extra={<a href="#">More</a>}
          style={{ width: '100%' }}
        >
          <Space direction="vertical">
            <Space direction="vertical">
              {props?.rules?.map((rule: Types.Rule, index: number) => {
                return (
                  <RuleRow
                    isFirst={props.rules.length < 2}
                    deleteRule={() => props.deleteRule(index)}
                    updateRule={(type, value) => {
                      props.updateRule(index, type, value)
                    }}
                    rule={rule}
                  />
                )
              })}
            </Space>

            {/* <Divider /> */}
            <Button
              style={{ marginTop: 20 }}
              type="primary"
              icon={<PlusOutlined />}
              onClick={e => props.addRule()}
            >
              Add
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  )
}

export default RuleCreator
