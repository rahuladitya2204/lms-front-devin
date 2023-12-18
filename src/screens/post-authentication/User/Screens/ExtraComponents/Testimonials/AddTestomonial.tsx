import { Button, Form, Image, Input, Rate } from 'antd'

import MediaUpload from '@Components/MediaUpload'
import TextArea from '@Components/Textarea'
import { Types } from '@adewaskar/lms-common'
import { useEffect } from 'react'

interface AddTestimonialPropsI {
  data?: Types.Testimonial;
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
    console.log(e, 'ee')
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
          // source={{
          //   type: 'event',
          //   value: props.event._id
          // }}
          uploadType="image"
          name="image"
          width="200"
          height="300px"
          cropper
          onUpload={({ url }) => {
            form.setFieldValue(['image'], url)
          }}
          // prefixKey={`events/${props.event._id}/testimonials`}
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

      <Form.Item label="Rating" name="rating">
        <Rate />
      </Form.Item>

      <Form.Item label="Testimonial" name="testimonial">
        <TextArea />
      </Form.Item>

      <Button type="primary" onClick={form.submit}>
        Add
      </Button>
    </Form>
  )
}
