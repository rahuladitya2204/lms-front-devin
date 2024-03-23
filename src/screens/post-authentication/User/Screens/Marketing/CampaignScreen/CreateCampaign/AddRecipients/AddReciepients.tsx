import { Constants, Types } from '@adewaskar/lms-common'
import { Form, Input, Radio, Tag } from 'antd'
import { useLayoutEffect, useState } from 'react'

import EmailListUploader from './RuleCreator/EmailListUploader'
import InputTags from '@Components/InputTags/InputTags'
import RuleCreator from './RuleCreator/RuleCreator'
import { deepPatch } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'

interface AddRecipientsPropsI {
  // data: any;
  // operator: string;
  // setOperator: (s: string) => void;
  // addRule: Function;
  // updateRule: Function;
  // deleteRule: Function;
  // rules: Types.Rule[];
}

const AddRecipients = ({  }: AddRecipientsPropsI) => {
  const form = Form.useFormInstance();
  const recipientsType = Form.useWatch(['recipients', 'type'],form) || Constants.INITIAL_CAMPAIGN_DETAILS.recipients.type
  const recipients = Form.useWatch(['recipients'],form) || Constants.INITIAL_CAMPAIGN_DETAILS.recipients;
  console.log(form.getFieldsValue(), 'lkl');
  return (
    <>
      <Form.Item
        name={['recipients', 'type']}
        rules={[{ required: true, message: 'Please recipient type' }]}
      >
        <Radio.Group>
          <Radio value="entire">Entire Audience</Radio>
          <Radio value="segment">Segment</Radio>
          <Radio value="email-list">Email List</Radio>
        </Radio.Group>
      </Form.Item>
      {recipients.type === 'email-list' ? (
        <Form.Item
          rules={[{ required: true, message: 'Please select an email list!' }]}
          label="Email List"
          name={['recipients', 'emailList']}
        >
          <EmailListUploader
            onChange={e => {
              console.log(e)
              form.setFieldValue(['recipients', 'emailList'], e)
            }}
          />
          <InputTags name={['recipients', 'emailList']} />
        </Form.Item>
      ) : null}
      {recipientsType === 'segment' ? (
        <RuleCreator/>
      ) : null}
    </>
  )
}

export default AddRecipients
