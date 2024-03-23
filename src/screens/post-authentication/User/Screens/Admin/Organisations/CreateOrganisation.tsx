import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import { Types, User } from '@adewaskar/lms-common'

import FileList from '@Components/FileList'
import MediaUpload from '@Components/MediaUpload'
import { useEffect } from 'react'
import useMessage from '@Hooks/useMessage'

interface CreateOrganisationPropsI {
  closeModal?: Function;
  data?: Partial<Types.Organisation>;
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

export default function CreateOrganisation(props: CreateOrganisationPropsI) {
  const [form] = Form.useForm()
  const message = useMessage()
  const {
    mutate: createOrg,
    isLoading: uploadingNews
  } = User.Queries.useCreateOrganisation()

  const {
    mutate: updateOrg,
    isLoading: updatingOrg
  } = User.Queries.useUpdateOrganisation()

  const onSubmit = (D: Partial<Types.Organisation>) => {
    console.log(D, 'DDDD')
    if (D._id) {
      updateOrg(
        {
          id: D._id,
          data: D
        },
        {
          onSuccess: () => {
            message.open({
              type: 'success',
              content: 'Organisation Updated Successfully'
            })
            form.resetFields()
            props.closeModal && props.closeModal()
          }
        }
      )
    } else {
      createOrg(D, {
        onSuccess: () => {
          message.open({
            type: 'success',
            content: 'Organisation Created Successfully'
          })
          form.resetFields()
          props.closeModal && props.closeModal()
        }
      })
    }
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
  const files = Form.useWatch(['files'], form) || []
  // console.log(files, 'files')
  return (
    <Form layout="vertical" form={form} onFinish={onSubmit}>
      <Form.Item label="Name" name="name">
        <Input />
      </Form.Item>

      <Form.Item label="Alias" name="alias">
        <Input />
      </Form.Item>

      <Form.Item label="Email" name="email">
        <Input />
      </Form.Item>
      <Row justify={'end'}>
        <Col>
          <Button loading={uploadingNews} onClick={form.submit} type="primary">
            {props.data?._id ? 'Update Organisation' : 'Create Organisation'}
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
