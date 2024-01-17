import { Button, Col, Form, Row, Select } from 'antd'

import { User } from '@adewaskar/lms-common'

export default function EnrollLearner () {
  const { data: learners } = User.Queries.useGetLearners()
    const [form] = Form.useForm();
    const createEnrollment = () => {
        
    }
  return (
    <Form form={form}>
      <Form.Item name="learner">
        <Select
          options={learners.map(l => {
            return {
              label: l.name,
              value: l._id
            }
          })}
        />
      </Form.Item>
      <Button type="primary">Create Enrollment</Button>
    </Form>
  )
}
