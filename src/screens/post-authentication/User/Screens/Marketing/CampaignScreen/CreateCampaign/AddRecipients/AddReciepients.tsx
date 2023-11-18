import { Form, Input, Radio, Tag } from 'antd'
import { useLayoutEffect, useState } from 'react'

import RuleCreator from './RuleCreator/RuleCreator'
import { Types } from '@adewaskar/lms-common'
import { deepPatch } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'

interface AddRecipientsPropsI {
  data: any;
  operator: string;
  setOperator: (s: string) => void;
  addRule: Function;
  updateRule: Function;
  deleteRule: Function;
  rules: Types.Rule[];
  campaign: Types.Campaign;
  updateCampaign: (d: Types.Campaign) => void;
}

const AddRecipients = ({ updateCampaign, campaign }: AddRecipientsPropsI) => {
  const [form] = Form.useForm()

  useLayoutEffect(
    () => {
      form.setFieldsValue(campaign)
    },
    [[campaign]]
  )
  const recipientsType = Form.useWatch(['recipients', 'type'], form)

  const setOperator = (op: string) => {
    console.log(op, '111')
    updateRecipients({
      operator: op
    })
  }

  const updateRecipients = (d: any) => {
    const data = deepPatch(campaign.recipients, d)
    // @ts-ignore
    updateCampaign({
      recipients: data
    })
  }
  const addRule = () => {
    const RULES: any[] = [...campaign.recipients.rules]
    RULES.push({
      operand: 'email',
      operator: '',
      value: ''
    })
    updateRecipients({
      rules: RULES
    })
  }

  const updateRule = (index: number, type: string, value: string) => {
    const RULES: any[] = [...campaign.recipients.rules]
    RULES[index][type] = value
    updateRecipients({
      rules: RULES
    })
  }

  const deleteRule = (index: number) => {
    const RULES: any[] = [...campaign.recipients.rules]
    RULES.splice(index, 1)
    updateRecipients({
      rules: RULES
    })
  }
  return (
    <Form
      form={form}
      onValuesChange={d => {
        const data = deepPatch(campaign, d)
        updateCampaign(data)
      }}
      layout="vertical"
    >
      <Form.Item name={['recipients', 'type']}>
        <Radio.Group>
          <Radio value="entire">Entire Audience</Radio>
          <Radio value="segment">Segment</Radio>
          <Radio value="email-list">Email List</Radio>
        </Radio.Group>
      </Form.Item>
      {campaign.recipients.type === 'email-list' ? (
        <Form.Item
          name={['recipients', 'emailList']}
          label="Email List"
          required
        >
          <Input placeholder="Enter receipients for the campaign" />
        </Form.Item>
      ) : null}
      {recipientsType === 'segment' ? (
        <RuleCreator
          operator={campaign.recipients.operator}
          setOperator={setOperator}
          updateRule={updateRule}
          addRule={addRule}
          deleteRule={deleteRule}
          rules={campaign.recipients.rules}
        />
      ) : null}
    </Form>
  )
}

export default AddRecipients
