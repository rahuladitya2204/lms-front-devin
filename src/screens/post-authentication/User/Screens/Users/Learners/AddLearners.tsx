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
  const [isModalOpen, setIsModalOpen] = useState(false)
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
        <Form.Item name="name" label="Name" required>
          <Input placeholder="Name of the learner" />
        </Form.Item>
        <Form.Item name="email" label="Email" required>
          <Input placeholder="Please enter email of the learner" />
        </Form.Item>
        <Button
          loading={createLearnerLoading || updateLearnerLoading}
          key="submit"
          type="primary"
          onClick={form.submit}
        >
          Submit
        </Button>
      </Form>
    </Fragment>
  )
}

export default AddLearner
