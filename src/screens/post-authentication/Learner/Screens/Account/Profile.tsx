import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  Row,
  Tabs
} from 'antd'
import { Learner, Store, Types } from '@adewaskar/lms-common'

import MediaUpload from '@Components/MediaUpload'
import { useEffect } from 'react'

export default function LearnerProfile() {
  const [form] = Form.useForm()
  const {
    mutate: updateProfile,
    isLoading: loadingProfile
    // @ts-ignore
  } = Learner.Queries.useUpdateLearnerProfile()
  const user = Store.useAuthentication(s => s.user)
  const saveProfile = (d: Partial<Types.Learner>) => {
    updateProfile({ data: d })
  }

  useEffect(
    () => {
      form.setFieldsValue(user)
    },
    [user]
  )

  return (
    <Form
      onFinish={saveProfile}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      layout="vertical"
      form={form}
    >
      <Row gutter={[20, 30]}>
        <Col span={24}>
          <Card>
            <Form.Item>
              <MediaUpload
                uploadType="image"
                prefixKey={`learners/${user._id}/image`}
                cropper
                // width="100%"
                // height="200px"
                aspect={16 / 9}
                renderItem={() => (
                  <Avatar
                    style={{ width: 200, height: 200 }}
                    // preview={false}
                    src={user.image}
                  />
                )}
                onUpload={file => {
                  saveProfile({
                    image: file.url
                  })
                }}
              />
            </Form.Item>
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Communication">
            {/* <Divider>Communication</Divider> */}
            <Form.Item
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: 'Enter a valid email'
                }
              ]}
              label="Email"
              name={['communication', 'email']}
            >
              <Input />
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  // type: ,
                  message: 'Enter a contact No'
                }
              ]}
              label="Contact No"
              name={['communication', 'contactNo']}
            >
              <Input />
            </Form.Item>
          </Card>
        </Col>
        <Col span={24} style={{ flexDirection: 'row-reverse' }}>
          <Button htmlType="submit" type="primary">
            {' '}
            Save Details
          </Button>
        </Col>
      </Row>

      {/* <Form.Item label="Email" name={['communication', 'email']}>
          <Input />
        </Form.Item> */}
    </Form>
  )
}
