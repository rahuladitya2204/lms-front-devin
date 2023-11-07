import { Button, Checkbox, Form, Input, Typography } from 'antd'
import { Learner, Store, Types } from '@adewaskar/lms-common'

import { ActionModalI } from '@Components/ActionModal'
import AuthenticationCard from '@Components/AuthenticationCard'
import React from 'react'
import { Utils } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router-dom'

interface LearnerRegisterPropsI extends ActionModalI {}

function LearnerRegister(props: LearnerRegisterPropsI) {
  const message = useMessage()
  const organisation = Store.useGlobal(o => o.organisation)
  const [form] = Form.useForm()
  const {
    mutate: Signup,
    isLoading: loading
  } = Learner.Queries.useRegisterLearner()

  const onFinish = async (values: Types.SignupData) => {
    try {
      await Signup(
        {
          email: values.email,
          password: values.password,
          name: values.name,
          contactNo: values.contactNo
        },
        {
          onSuccess: user => {
            // @ts-ignore
            if (user.organisation)
              // @ts-ignore
              Utils.Storage.SetItem('orgId', user.organisation)
            props.closeModal && props.closeModal()
            form.resetFields()
            message.open({
              type: 'success',
              content: `Congratulation ${user.name}, Welcome to ${
                organisation.name
              }!`
            })
          }
        }
      )
    } catch (error) {
      console.error('Signup failed:', error)
    }
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
              min: 10,
              message: 'Contact number should be at least 10 digits long!'
            }
          ]}
          hasFeedback
        >
          <Input />
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
