import { Button, Card, Form, Input, Tabs } from 'antd'
import { useEffect, useState } from 'react'

import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { Types } from '@adewaskar/lms-common'
import { UploadOutlined } from '@ant-design/icons'
import { User } from '@adewaskar/lms-common'

export default function UserProfile() {

    const [form] = Form.useForm<Types.Organisation>();
    const { data } = User.Queries.useGetUserAccountDetails()
    const [organisation, setAccount] = useState<Partial<Types.Organisation>>({})
    
    useEffect(() => {
      form.setFieldsValue(organisation);
    }, [organisation]);


  const onFormUpdate = (data: Partial<Types.Organisation>) => {
    setAccount({
      ...organisation,
      ...data
    })
  }

    const {
      mutate: updateUserAccount,
      isLoading: loading
    } = User.Queries.useUpdateUserAccount();
    

  return (
    <Card>
      <Form onValuesChange={onFormUpdate} form={form}>
        <Form.Item name="image" required label="Profile Image">
          <MediaUpload
            width="100px"
            renderItem={() => <Image src={organisation.logo} />}
            onUpload={e => {
              onFormUpdate({
                logo:e.url
              })
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
            onClick={()=>updateUserAccount({data:organisation})}
            icon={<UploadOutlined />}
          >
            Save Account
          </Button>{' '}
        </Form.Item>
      </Form>
    </Card>
  )
}
