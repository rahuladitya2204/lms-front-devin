import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import { Button, Form, Input, Space } from 'antd'

interface ExternalVideoPropsI {
  platform: {
    value: string,
    label: string
  };
  onSubmit: (d: { link: string, title: string }) => void;
}

export default function ExternalVideo(props: ExternalVideoPropsI) {
  const [form] = Form.useForm()
  const link = Form.useWatch('link', form)
  return (
    <Form layout="vertical" onFinish={props.onSubmit} form={form}>
      <Form.Item name="link" label={`${props.platform.label} Link`}>
        <Input />
      </Form.Item>

      {/* <Form.Item name="title" label={`Video Title`}>
        <Input />
      </Form.Item> */}

      {link ? (
        <Form.Item label="Preview">
          <MediaPlayer
            url={link}
            platform={props.platform.value}
            height={400}
          />
        </Form.Item>
      ) : null}

      <Space direction="horizontal">
        {' '}
        <Button>Clear</Button>{' '}
        <Button onClick={form.submit} type="primary">
          Submit
        </Button>
      </Space>
    </Form>
  )
}
