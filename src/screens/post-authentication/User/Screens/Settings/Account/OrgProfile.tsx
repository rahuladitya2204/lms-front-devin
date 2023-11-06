import { Button, Card, Col, ColorPicker, Form, Input, Row, Select, Spin, Tabs } from 'antd'
import { CheckCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { Types, User } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'

import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import Title from 'antd/es/typography/Title'
import { debounce } from 'lodash'
import { useFontValidation } from '@Hooks/useFontValidation'

export default function OrgProfile() {

  const [form] = Form.useForm<Types.OrganisationSetting>();
  const { useWatch } = Form;

 
  const { data: orgSetting,isLoading } = User.Queries.useGetOrgSetting();
  
  useEffect(() => {
    form.setFieldsValue(orgSetting)
   },[orgSetting])

    const {
      mutate: updateOrgAccount,
      isLoading: loading
    } = User.Queries.useUpdateOrgSetting();
    
  const onSubmit = (data:Partial<Types.OrganisationSetting>) => { 
    updateOrgAccount({ data });
  }
  const { isFontValidating, isFontValid, validateFontName } = useFontValidation(form);

  const logoUrl = useWatch(['branding','logo','url'], form);

  return (
    <Spin spinning={ isLoading}>
      <Card>
      <Form layout='vertical' onFinish={onSubmit} form={form}>
        <Form.Item style={{marginBottom:50}} required name={['branding','logo','url']} label="Logo">
          <div style={{width:150,height:100}}>
          <MediaUpload                 uploadType="image"
 name={['branding','logo','url']} cropper
            width="100px"
            renderItem={() => <Image width={'70%'} src={logoUrl}  />}
              onUpload={e => {
                console.log(e, 'eeee');
              form.setFieldValue(['branding','logo','url'], e.url);
            }}
          />
          </div>
        </Form.Item>
        {/* <Form.Item name={['alias']} required label="Alias">
          <Input style={{width:500}} />
        </Form.Item> */}

{/*                 
        <Form.Item name="email" required label="Email">
          <Input style={{width:500}} />
        </Form.Item> */}

        
        <Title level={3}>Branding Colors</Title>

          <Row>
            <Col span={4}>
            <Form.Item
  name={['branding', 'colors', 'primary']}
  label="Primary Color"
  rules={[{ required: true, message: 'Please select a primary color' }]}
>
  <ColorPicker />
</Form.Item>
            </Col>
            <Col span={4}>
            <Form.Item
  name={['branding', 'colors', 'secondary']}
  label="Secondary Color"
  rules={[{ required: true, message: 'Please select a secondary color' }]}
>
  <ColorPicker />
              </Form.Item>
   </Col>
          </Row>
          <Form.Item
  name={['branding', 'theme']}
  label="Select Theme"
  // rules={[{ required: true, message: 'Please select a theme' }]}
>
  <Select style={{ width: 200 }}>
    <Select.Option value="light">Light</Select.Option>
    <Select.Option value="dark">Dark</Select.Option>
  </Select>
</Form.Item>

        <Form.Item name={['branding','colors','tertiary']} required label="Tertiary Color">
          <Input style={{width:500}} />
        </Form.Item>


        <Title level={3}>Font</Title>

                     
        <Form.Item
  name={['branding', 'font', 'name']}
  label="Font Name"
  rules={[
    {
      required: true,
      message: 'Please enter the font name',
    },
    {
      validator: validateFontName,
    },
  ]}
  hasFeedback
>
  <Input
    style={{ width: 500 }}
    placeholder='Please enter the font name you want to be used'
  />
</Form.Item>



                     
        <Form.Item name={['branding','font','url']} required label="Font Link">
          <Input style={{width:500}} placeholder='Please enter font name which you want to be used' />
        </Form.Item>

        <Title level={3}>Fav Icon</Title>

        <Form.Item name={['branding','favIcon','url']} required label="Fav Name">
          <Input style={{width:500}} placeholder='Please enter font name which you want to be used' />
        </Form.Item>
        
        <Form.Item>
          <Button
            loading={loading}
            type="primary"
              onClick={form.submit}
              htmlType="submit" // This tells the button to submit the form

            icon={<UploadOutlined />}
          >
            Save Account
          </Button>{' '}
        </Form.Item>
      </Form>
    </Card>
    </Spin>
  )
}
