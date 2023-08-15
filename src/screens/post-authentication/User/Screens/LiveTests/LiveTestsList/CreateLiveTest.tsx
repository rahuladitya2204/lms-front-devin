import { Button, Form, Input, Modal, Select } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'
import React, { ReactNode } from 'react'

import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'
import { useNavigate } from 'react-router'

interface CreateLiveTestPropsI {
  children?: ReactNode;
  closeModal?: any;
}

const CreateLiveTest: React.FC<CreateLiveTestPropsI> = props => {
  const navigate = useNavigate()
  const message = useMessage()
  const {
    mutate: createLiveTest,
    isLoading: loading
  } = User.Queries.useCreateLiveTest()
  const [form] = Form.useForm()

  const onSubmit = (e: Types.LiveTest) => {
    console.log('Helo')
    createLiveTest(e, {
      onSuccess: ({ data: liveTest }) => {
        console.log(liveTest, 'here it is')
        // @ts-ignore
        navigate(`${liveTest._id}/editor#information`)
        message.open({
          type: 'success',
          content: 'Have fun creating a liveTest!'
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
        tooltip="Title of your liveTest"
        rules={[
          { required: true, message: 'Please mention title for liveTest' }
        ]}
      >
        <Input placeholder="Enter your liveTest title" />
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

export default CreateLiveTest
