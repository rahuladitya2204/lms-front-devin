import { Button, Checkbox, Form, Input, Typography } from 'antd'
import { Common, Learner, Store, Types } from '@adewaskar/lms-common'

import { ActionModalI } from '@Components/ActionModal'
import AuthenticationCard from '@Components/AuthenticationCard'
import React from 'react'
import { Utils } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router-dom'

interface LearnerRegisterPropsI extends ActionModalI {}

function LearnerRegister(props: LearnerRegisterPropsI) {
  const message = useMessage()
  const { data: organisation } = Common.Queries.useGetOrgDetails()
  const [form] = Form.useForm()
  const {
    mutate: Signup,
    isLoading: loading
  } = Learner.Queries.useRegisterLearner()

  const onFinish = async (values: Types.SignupData) => {
    Signup(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        contactNo: values.contactNo
      },
      {
        onSuccess: user => {
          console.log('hello', user, 'huh')
          if (user.organisation) {
            Utils.Storage.SetItem('orgId', user.organisation)
          }
          form.resetFields()
          message.open({
            type: 'success',
            content: `Congratulation ${user.name}, Welcome to ${
              organisation.name
            }!`
            // icon: organisation.logo
          })
          props.closeModal && props.closeModal()
        },
        onError: (er: any) => {
          message.open({
            type: 'error',
            content: er.response.data.message
          })
        }
      }
    )
  }

  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!'
    },
    string: {
      min: '${label} must be at least ${min} characters'
    }
  }

  return (
    <AuthenticationCard title={'Register'}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true }]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        {/* Added Contact Number Input */}

        <Form.Item
          name="contactNo"
          label="Contact Number"
          rules={[
            { required: true, message: 'Please input your contact number!' },
            {
              len: 10,
              message: 'Contact number should be 10 digits!'
            }
          ]}
          hasFeedback
        >
          <Input type='number' />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: 'email' }]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, min: 8 }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button loading={loading} block type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </AuthenticationCard>
  )
}

export default LearnerRegister
