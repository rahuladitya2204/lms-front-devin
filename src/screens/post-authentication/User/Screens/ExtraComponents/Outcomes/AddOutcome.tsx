import { Button, Form, Input } from 'antd'

import TextArea from '@Components/Textarea';
import { Types } from '@adewaskar/lms-common'
import { useEffect } from 'react';

export interface Outcome {
    title: string;
    description: string;
}

interface AddOutcomePropsI {
    data?: Outcome
    closeModal?: () => void;
    submit:(d:Outcome)=>void
}

export default function AddOutcome (props: AddOutcomePropsI) {
  const [form] = Form.useForm()

  useEffect(
    () => {
      form.setFieldsValue(props.data)
    },
    [props.data]
  )

  const onSubmit=(e: Outcome) => {
    props.submit(e);
    form.resetFields();
    props.closeModal&&props.closeModal()
}
    
  return (
      <Form layout='vertical' onFinish={onSubmit} form={form}>
      <Form.Item label="Title" name="title">
        <Input />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <TextArea />
      </Form.Item>

      <Button type='primary' onClick={form.submit}>Add</Button>
    </Form>
  )
}
