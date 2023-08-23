import { Button, Form, Input, Modal, Select } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'
import React, { ReactNode } from 'react'

import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'
import { useNavigate } from 'react-router'

interface CreateTestPropsI {
  children?: ReactNode;
  closeModal?: any;
}

const CreateTest: React.FC<CreateTestPropsI> = props => {
  const navigate = useNavigate()
  const message = useMessage()
  const {
    mutate: createTest,
    isLoading: loading
  } = User.Queries.useCreateTest()
  const [form] = Form.useForm()

  const onSubmit = (e: Types.Test) => {
    console.log('Helo')
    createTest(e, {
      onSuccess: ({ data: Test }) => {
        console.log(Test, 'here it is')
        // @ts-ignore
        navigate(`${Test._id}/editor#information`)
        message.open({
          type: 'success',
          content: 'Have fun creating a Test!'
        })
        props.closeModal && props.closeModal()
      }
    })
  }
  // const { listItems: instructors } = User.Queries.useGetInstructors()
  return (
    <Form form={form} onFinish={onSubmit} layout="vertical">
      <Form.Item
        name="title"
        label="Title"
        required
        tooltip="Title of your Test"
        rules={[
          { required: true, message: 'Please mention title for Test' }
        ]}
      >
        <Input placeholder="Enter your Test title" />
      </Form.Item>
      <Button
        loading={loading}
        key="submit"
        type="primary"
        onClick={form.submit}
      >
        Submit
      </Button>
    </Form>
  )
}

export default CreateTest
