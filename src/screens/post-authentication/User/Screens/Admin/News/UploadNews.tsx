import { Button, DatePicker, Form, Select } from 'antd'
import { Types, User } from '@adewaskar/lms-common'

import MediaUpload from '@Components/MediaUpload'
import { useEffect } from 'react'
import useMessage from '@Hooks/useMessage'

interface UploadNewsPropsI {
  closeModal?: Function;
  data?: Types.News;
}

const PUBLICATIONS = [
  {
    label: 'The Hindu',
    value: 'the-hindu'
  },
  {
    label: 'The Tribune',
    value: 'the-hindu'
  }
]

export default function UploadNews(props: UploadNewsPropsI) {
  const [form] = Form.useForm()
  const message = useMessage()
  const {
    mutate: uploadNews,
    isLoading: uploadingNews
  } = User.Queries.useUploadNews()
  const onSubmit = (D: Types.News) => {
    console.log(D, 'DDDD')
    //   @ts-ignore
    D.date = D.date.toDate()
    uploadNews(
      {
        data: D
      },
      {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'News Uploaded Successfully'
          });
          props.closeModal && props.closeModal();
        }
      }
    )
  }

  useEffect(
    () => {
      // @ts-ignore
      if (props?.data?._id) {
        form.setFieldsValue(props.data)
      }
    },
    [props.data]
  )

  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
      <Form.Item label="Date" name="date">
        <DatePicker />
      </Form.Item>
      <Form.Item name="file" label="PDF File">
        <MediaUpload
          uploadType="file"
          cropper={{ aspect: 1 }}
          compress={{ maxWidth: 200, maxHeight: 200 }}
          width="100px"
          name="file"
          // renderItem={() => <Image width={'70%'} src={thumbnailImage} />}
          onUpload={e => {
            console.log(e, 'eeee')
            form.setFieldValue(['file'], {
              file: e._id,
              url: e.url
            })
          }}
        />
      </Form.Item>
      <Form.Item label="Publication" name="publication">
        <Select options={PUBLICATIONS} />
      </Form.Item>
      <Button loading={uploadingNews} onClick={form.submit} type="primary">
        Upload News Paper
      </Button>
    </Form>
  )
}
