import { Button, Card, Form, Input, Tabs } from 'antd'
import { useEffect, useState } from 'react'
import { useGetUserAccountDetails, useUpdateUserAccount } from '@User/Api/queries'

import { INITIAL_ORG_DETAILS } from 'constant.ts'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { Organisation } from '@Types/Organisation'
import { UploadOutlined } from '@ant-design/icons'

export default function UserProfile() {

    const [form] = Form.useForm<Organisation>();
    const { data } = useGetUserAccountDetails()
    const [organisation, setAccount] = useState<Partial<Organisation>>({})
    
    useEffect(() => {
      form.setFieldsValue(organisation);
    }, [organisation]);


  const onFormUpdate = (data: Partial<Organisation>) => {
    setAccount({
      ...organisation,
      ...data
    })
  }

    const {
      mutate: updateUserAccount,
      isLoading: loading
    } = useUpdateUserAccount();
    

  return (
    <Card>
      <Form onValuesChange={onFormUpdate} form={form}>
        <Form.Item name="image" required label="Profile Image">
          <MediaUpload
            url={'image'}
            // rounded
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
