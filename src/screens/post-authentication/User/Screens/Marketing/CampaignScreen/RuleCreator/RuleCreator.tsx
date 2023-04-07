import { Button, Card, Col, Divider, Form, Row, Space, Table, Typography } from 'antd'

import { FormInstance } from 'antd/lib/form/Form';
import { PlusOutlined } from '@ant-design/icons'
import RuleRow from './RuleRow'
import { Types } from '@adewaskar/lms-common'
import { useState } from 'react';

interface RuleCreatorPropsI {
    rules: Types.Rule[];
    form: FormInstance<any>;
    updateRules: (r: Types.Rule[])=> void;
}

function RuleCreator (props:RuleCreatorPropsI) {
    const [rules, setRules] = useState<Types.Rule[]>(props.rules);
    const updateRule = (index:number,type:string,value:string) => {
        const RULES:any[] = [...rules];
        RULES[index][type] = value;
        setRules(RULES);
        props.form.setFieldValue(['recipients', 'rule'], RULES);

    }

    const addRule = () => {
        const RULES:any[] = [...rules];
        RULES.push({
            operand: 'email',
            operator: '',
            value: ''
        })
        setRules(RULES);
        props.form.setFieldValue(['recipients', 'rule'], RULES);

    }

    const deleteRule = (index:number) => {
        const RULES:any[] = [...rules];
        RULES.splice(index,1)
        setRules(RULES);
        props.form.setFieldValue(['recipients','rule'],RULES)

    }

  return (
    <Row>
      <Col span={24}>
        <Card
          title={
            <Typography.Text>
              Learners Match any of the following conditions
            </Typography.Text>
          }
          extra={<a href="#">More</a>}
          style={{ width: '100%' }}
        >
                  <Space direction='vertical'>
                  <Space direction='vertical'>
                  {rules.map((rule,index) => {
              return <RuleRow deleteRule={()=>deleteRule(index)} updateRule={(type,value) => {
                  updateRule(index, type, value);
            }} rule={rule} />
          })}
          </Space>
                  
                  {/* <Divider /> */}
                  <Button style={{marginTop:20}} type='primary' icon={<PlusOutlined />} onClick={addRule}>Add</Button>
                 </Space>
        </Card>
      </Col>
    </Row>
  )
}

export default RuleCreator
