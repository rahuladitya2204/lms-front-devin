import { Button, Checkbox, Form, Input, Typography } from 'antd'
import { Common, Learner, Store, Types } from '@adewaskar/lms-common'
import React, { useEffect } from 'react'

import { ActionModalI } from '@Components/ActionModal/ActionModal'
import AuthenticationCard from '@Components/AuthenticationCard'
import { Utils } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router-dom'

interface LearnerRegisterPropsI extends ActionModalI {
  onRegisterSuccess?: Function;
  data?: Partial<Types.Learner>;
}

function LearnerRegister(props: LearnerRegisterPropsI) {
  const message = useMessage()
  const setIsSignedin = Store.useAuthentication(s => s.setIsSignedin)
  const { data: organisation } = Learner.Queries.useGetOrgDetails()
  const [form] = Form.useForm()
  const {
    mutate: Signup,
    isLoading: loading
  } = Learner.Queries.useRegisterLearner()

  const onFinish = async (values: Types.SignupData) => {
    console.log('signing up')
    Signup(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        contactNo: values.contactNo,
        onSuccess: (user: any) => {
          console.log('hello', user, 'huh')
          if (user.organisation) {
            Utils.Storage.SetItem('orgId', user.organisation)
          }
          form.resetFields()
          message.open({
            type: 'success',
            content: `Registered successfully ${user.name}, Welcome to ${
              organisation.name
            }!`
            // icon: organisation.logo
          })
          setIsSignedin(true)
          props.onRegisterSuccess && props.onRegisterSuccess()
          props.closeModal && props.closeModal()
        }
      },
      {
        onError: (er: any) => {
          message.open({
            type: 'error',
            content: er.response.data.message
          })
        },
        onSettled: console.log
      }
    )
  }

  useEffect(
    () => {
      console.log(props.data, 'asdasd')
      if (props.data) {
        form.setFieldsValue(props.data)
      }
    },
    [props.data]
  )

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
          <Input type="number" />
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
