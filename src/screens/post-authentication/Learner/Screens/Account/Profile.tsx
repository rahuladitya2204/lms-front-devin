import { Card, Form, Input, Tabs } from 'antd'

export default function LearnerProfile () {
  return (
    <Card>
      <Form
        labelCol={{ span: 4}}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
      >
        <Form.Item label="Account Name" name="size">
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="size">
          <Input />
        </Form.Item>
      </Form>
    </Card>
  )
}
