import { Button, Card, Col, ColorPicker, Form, Input, Row, Select, Spin, Tabs } from 'antd'
import { CheckCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { Types, User } from '@invinciblezealorg/lms-common'
import { useEffect, useState } from 'react'

import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { Title } from '@Components/Typography/Typography'
import { debounce } from 'lodash'
import { generateGradients } from '@Utils/index'
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
    
  const onSubmit = (data: Partial<Types.OrganisationSetting>) => { 
    // @ts-ignore
    if (data.branding?.colors.primary?.metaColor) {
    // @ts-ignore
    data.branding.colors.primary = data.branding?.colors.primary?.metaColor?.originalInput;
    }
       // @ts-ignore
 if (data.branding?.colors.secondary?.metaColor) {
      // @ts-ignore
      data.branding.colors.secondary = data.branding?.colors.secondary?.metaColor?.originalInput;
      }
    updateOrgAccount({ data });
  }
  const { isFontValidating, isFontValid, validateFontName } = useFontValidation(form);

  const logo = useWatch(['branding', 'logo'], form);
  

  useEffect(() => {
    const primaryColor = form.getFieldValue(['branding', 'colors', 'primary']);
    if (primaryColor) {
      const gradients = generateGradients(primaryColor);
      console.log(gradients,'gradients')
      form.setFieldValue(['branding', 'gradient'], gradients);
      // form.setFieldsValue({
      //   branding: {
      //     gradient: gradients
      //   }
      // });
    }
  }, [form, generateGradients]);
  

  return (
    <Spin spinning={ isLoading}>
      <Card>
      <Form layout='vertical' onFinish={onSubmit} form={form}>
        <Form.Item style={{marginBottom:50}} required name={['branding','logo','low','url']} label="Logo">
          <div style={{width:150,height:100}}>
          <MediaUpload                 uploadType="image"
 name={['branding','logo','low','url']} cropper={{width:150,height:150}} compress={{quality:0.9,maxHeight: 150,height:150}}
            width="100px"
            renderItem={() => <Image width={'70%'} src={logo?.low?.url}  />}
              onUpload={e => {
                console.log(e, 'eeee');
              form.setFieldValue(['branding','logo','low','url'], e.url);
            }}
          />
          </div>
          </Form.Item>
          <Form.Item style={{marginBottom:50}} required name={['branding','logo','high','url']} label="Logo">
          <div style={{width:150,height:100}}>
          <MediaUpload                 uploadType="image"
 name={['branding','logo','high','url']} 
            width="100px"
            renderItem={() => <Image width={'70%'} src={logo?.high?.url}  />}
              onUpload={e => {
                console.log(e, 'eeee');
              form.setFieldValue(['branding','logo','high','url'], e.url);
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
          <Row gutter={[20,20]}>
          <Col span={6}>
    <Form.Item
      name={['branding', 'gradient', 'type1']}
      label="Gradient Type 1"
    >
      <Select mode="tags" style={{ width: '100%' }} placeholder="Select gradient type 1" />
    </Form.Item>
  </Col>
  <Col span={6}>
    <Form.Item
      name={['branding', 'gradient', 'type2']}
      label="Gradient Type 2"
    >
      <Select mode="tags" style={{ width: '100%' }} placeholder="Select gradient type 2" />
    </Form.Item>
            </Col>
            <Col span={6}>
    <Form.Item
      name={['branding', 'gradient', 'type3']}
      label="Gradient Type 3"
    >
      <Select mode="tags" style={{ width: '100%' }} placeholder="Select gradient type 2" />
    </Form.Item>
            </Col>
            <Col span={6}>
    <Form.Item
      name={['branding', 'gradient', 'type4']}
      label="Gradient Type 4"
    >
      <Select mode="tags" style={{ width: '100%' }} placeholder="Select gradient type 2" />
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

        {/* <Form.Item name={['branding','colors','tertiary']} required label="Tertiary Color">
          <Input style={{width:500}} />
        </Form.Item> */}

<Title level={3}>Short Name</Title>

                     
<Form.Item
name={['shortName']}
label="Short Name"
rules={[
{
required: true,
message: 'Please enter a short name for your organisation',
}
]}
>
<Input
style={{ width: 500 }}
placeholder='Please enter a short name for your org to be used in FavIcon, web title'
/>
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
        <Form.Item label="Upload FavIcon" required name={['branding','favIcon','url']}>
          <MediaUpload width={'200px'} height={'200px'}
            // isProtected
            uploadType="file"
              onUpload={({ _id, name, url }) => {
                form.setFieldValue(['branding', 'favIcon', 'url'], url);
              // setFiles([...files, { name: name, file: _id }]);
            }}
          />{' '}
        </Form.Item>
        <Form.Item name={['branding','favIcon','url']} required label="Favicon Url">
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
