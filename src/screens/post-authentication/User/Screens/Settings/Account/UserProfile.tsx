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
  Spin,
  Tabs,
  message
} from 'antd'
import { Store, Types, User } from '@adewaskar/lms-common'

import Header from '@Components/Header'
import MediaUpload from '@Components/MediaUpload'
import { useEffect } from 'react'

export default function UserProfile() {
  const [form] = Form.useForm()
  const {
    mutate: updateProfile,
    isLoading: updatingProfile
  } = User.Queries.useUpdateUserAccount()
  const {
    data: userDetails,
    isLoading: loadingDetails
  } = User.Queries.useGetUserDetails()

  const saveProfile = (d: Partial<Types.User>) => {
    updateProfile(
      { data: d },
      {
        onSuccess: () => {
          message.success('Profile details saved')
        }
      }
    )
  }

  useEffect(
    () => {
      form.setFieldsValue(userDetails)
    },
    [userDetails]
  )

  return (
    <Header
      title="My Profile"
      extra={[
        <Button loading={updatingProfile} onClick={form.submit} type="primary">
          {' '}
          Save Details
        </Button>
      ]}
    >
      <Spin spinning={loadingDetails}>
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
                    prefixKey={`users/${userDetails._id}/image`}
                    cropper={{aspect: 1}}
                    width="200px"
                    // height="200px"
                    aspect={16 / 9}
                    renderItem={() => (
                      <Avatar
                        style={{ width: 200, height: 200 }}
                        // preview={false}
                        src={userDetails.image}
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
            {/* <Col span={24} style={{ flexDirection: 'row-reverse' }}>
              <Button
                loading={updatingProfile}
                htmlType="submit"
                type="primary"
              >
                {' '}
                Save Details
              </Button>
            </Col> */}
          </Row>

          {/* <Form.Item label="Email" name={['communication', 'email']}>
          <Input />
        </Form.Item> */}
        </Form>
      </Spin>
    </Header>
  )
}
