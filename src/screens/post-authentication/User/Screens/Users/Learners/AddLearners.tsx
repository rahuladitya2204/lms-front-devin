import { Button, Form, Input, Modal } from 'antd'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CreateLearnerComponentPropsI {
  children?: ReactNode;
  data?: Types.Learner;
  closeModal?: Function;
}

const AddLearner: React.FC<CreateLearnerComponentPropsI> = props => {
  const {
    mutate: createLearner,
    isLoading: createLearnerLoading
  } = User.Queries.useCreateLearner()
  const {
    mutate: updateLearner,
    isLoading: updateLearnerLoading
  } = User.Queries.useUpdateLearner()

  const [form] = Form.useForm()

  const onSubmit = (e: Types.CreateLearnerPayload) => {
    if (props.data) {
      updateLearner(
        { id: props.data._id, data: e },
        {
          onSuccess: () => {
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      createLearner(e, {
        onSuccess: () => {
          props.closeModal && props.closeModal()
        }
      })
    }
  }

  useEffect(
    () => {
      form.setFieldsValue(props.data)
    },
    [props.data]
  )

  return (
    <Fragment>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          rules={[
            { required: true, message: 'Please enter name of the learner' }
          ]}
          name="name"
          label="Learner Name"
          required
        >
          <Input placeholder="Name of the learner" />
        </Form.Item>
        <Form.Item
          label="Learner's Mobile Number"
          name="contactNo"
          hasFeedback
          rules={[
            {
              required: true,
              message: `Please enter learner's mobile number!`
            },
            {
              len: 10,
              message: 'Contact number should be 10 digits!'
            }
          ]}
        >
          <Input placeholder="Mobile Number of the learner" type="number" />
        </Form.Item>
        <Button
          loading={createLearnerLoading || updateLearnerLoading}
          key="submit"
          type="primary"
          htmlType="submit"
          // onClick={form.submit}
        >
          Add Learner
        </Button>
      </Form>
    </Fragment>
  )
}

export default AddLearner
