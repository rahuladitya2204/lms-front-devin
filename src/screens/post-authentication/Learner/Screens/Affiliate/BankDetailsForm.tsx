import { Form, Input } from 'antd'

export default function BankDetailsForm() {
  const onSubmit = (e: any) => {
    console.log(e)
  }
  const [form] = Form.useForm()
  return (
    <Form layout="vertical" onFinish={onSubmit} form={form}>
      <Form.Item name="accountName" label="Account Holder Name">
        <Input />
      </Form.Item>

      <Form.Item name="accountNo" label="Account Number">
        <Input />
      </Form.Item>

      <Form.Item name="ifscCode" label="Account IFSC Code">
        <Input />
      </Form.Item>

      <Form.Item name="panId" label="Pan Card Number">
        <Input />
      </Form.Item>
    </Form>
  )
}
