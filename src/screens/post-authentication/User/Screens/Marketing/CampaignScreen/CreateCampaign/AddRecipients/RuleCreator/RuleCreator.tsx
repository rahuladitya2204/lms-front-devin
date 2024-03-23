import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Row,
  Select,
  Space,
  Table
} from 'antd'

import { FormInstance } from 'antd/lib/form/Form'
import { PlusOutlined } from '@ant-design/icons'
import RuleRow from './RuleRow'
import { Types } from '@invinciblezealorg/lms-common'
import { Typography } from '@Components/Typography'

interface RuleCreatorPropsI {

}

function RuleCreator(props: RuleCreatorPropsI) {
  const form = Form.useFormInstance()
  const rules = Form.useWatch(['recipients', 'rules'], form) || []
  return (
    <Row>
      <Col span={24}>
        <Card
          title={
            <Typography.Text>
              Learners Match{' '}
              <Form.Item
                style={{
                  display: 'inline-block',
                  width: 75,
                  margin: '0 6px',
                  marginTop: '-3px'
                }}
                name={['recipients', 'operator']}
                rules={[
                  {
                    required: true,
                    message: 'Please input a value'
                  }
                ]}
              >
                <Select
                  size="small"
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
                />
              </Form.Item>
              of the following conditions
            </Typography.Text>
          }
          extra={<a href="#">More</a>}
          style={{ width: '100%' }}
        >
          <Space direction="vertical">
          <Form.List name={['recipients', 'rules']}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, },index) => {
                return <RuleRow key={key}
                isFirst={rules.length < 2}
                name={name}
                remove={() => remove(index)}
              />
              })}
            <Button
              style={{ marginTop: 20 }}
              type="primary"
              icon={<PlusOutlined />}
                    onClick={e => add({
                      operand: 'email',
                      operator:'contains'
              })}
            >
              Add
                    </Button>
                  </>)
          }
          
        </Form.List>
      
          </Space>
        </Card>
      </Col>
    </Row>
  )
}

export default RuleCreator
