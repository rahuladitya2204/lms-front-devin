import MediaUpload from '@Components/MediaUpload'
import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'
import { Button, Form, Image, Input } from 'antd'
import { useEffect } from 'react'

interface AddTestimonialPropsI {
  data?: Types.Testimonial;
  liveSession: Types.LiveSession;
  closeModal?: () => void;
  submit: (d: Types.Testimonial) => void;
}

export default function AddTestimonial(props: AddTestimonialPropsI) {
  const [form] = Form.useForm()

  useEffect(
    () => {
      form.setFieldsValue(props.data)
    },
    [props.data]
  )

  const onSubmit = (e: Types.Testimonial) => {
    props.submit(e)
    form.resetFields()
    props.closeModal && props.closeModal()
  }
  const image = Form.useWatch('image', form)
  console.log(image, 'imim')

  return (
    <Form onFinish={onSubmit} layout="vertical" form={form}>
      <Form.Item label="Avatar" name="image">
        <MediaUpload
          source={{
            type: 'liveSession',
            value: props.liveSession._id
          }}
          uploadType="image"
          name="image"
          width="200"
          height="300px"
          prefixKey={`live-sessions/${props.liveSession._id}/testimonials`}
          renderItem={() => (
            <Image
              width={100}
              height={100}
              preview={false}
              src={props?.data?.image}
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Name" name="name">
        <Input />
      </Form.Item>

      <Form.Item label="Designation" name="designation">
        <Input />
      </Form.Item>

      <Form.Item label="Testiominal" name="testimonial">
        <TextArea />
      </Form.Item>

      <Button type="primary" onClick={form.submit}>
        Add
      </Button>
    </Form>
  )
}
