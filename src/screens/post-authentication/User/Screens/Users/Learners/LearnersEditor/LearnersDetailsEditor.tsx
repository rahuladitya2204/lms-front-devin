import { Form, Input } from 'antd'
import React, { Fragment } from 'react'

interface CreateLearnerComponentPropsI {}

const LearnerDetailsEditor: React.FC<CreateLearnerComponentPropsI> = props => {
  return (
    <Fragment>
      <Form.Item name="name" label="Name" required>
        <Input placeholder="Name of the student" />
      </Form.Item>
      <Form.Item name="email" label="Email" required>
        <Input placeholder="Please enter email of the learner" />
      </Form.Item>

      <Form.Item name="contactNo" label="Mobile" required>
        <Input placeholder="Please enter contact number of the learner" />
      </Form.Item>
    </Fragment>
  )
}

export default LearnerDetailsEditor
