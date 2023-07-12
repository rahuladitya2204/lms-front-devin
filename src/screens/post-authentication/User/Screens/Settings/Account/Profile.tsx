import { Button, Card, Form, Input, Tabs } from 'antd'
import { useEffect, useState } from 'react'

import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { Types } from '@adewaskar/lms-common'
import { UploadOutlined } from '@ant-design/icons'
import { User } from '@adewaskar/lms-common'

export default function UserProfile() {

  const [form] = Form.useForm<Types.Organisation>();
  const { useWatch } = Form;

  const logo = useWatch(['logo'], form);
 
    const {
      mutate: updateUserAccount,
      isLoading: loading
    } = User.Queries.useUpdateUserAccount();
    
  const onSubmit = (data:Types.Organisation) => { 
    updateUserAccount({data})
  }

  const { data: url } = User.Queries.useGetProviderLoginUrl('facebook');
  return (
    <Card>
      <Form onFinish={onSubmit} form={form}>
        <Form.Item name="image" required label="Profile Image">
          <MediaUpload
            width="100px"
            renderItem={() => <Image src={logo} />}
            onUpload={e => {
              form.setFieldValue(['logo'], e.url);
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            onClick={form.submit}
            icon={<UploadOutlined />}
          >
            Save Account
          </Button>{' '}
        </Form.Item>
      </Form>
    </Card>
  )
}
