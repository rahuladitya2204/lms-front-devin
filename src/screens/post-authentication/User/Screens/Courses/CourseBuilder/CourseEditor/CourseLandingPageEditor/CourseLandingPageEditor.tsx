import {
  Button,
  Form,
  Input,
} from 'antd'
import { Fragment, useEffect } from 'react'

import MediaPlayer from '@Components/MediaPlayer';
import MediaUpload from '@Components/MediaUpload';
import { Types } from '@adewaskar/lms-common'

interface CourseLandingPageEditorPropsI {
    formData: Types.CourseLandingPage;
    courseId: string;
      onFormUpdate: (d:Types.CourseLandingPage)=>void;
    }
    
    function CourseLandingPageEditor(props:CourseLandingPageEditorPropsI) {
      const [form] = Form.useForm<Types.CourseLandingPage>();    
      const PromoVideoUrl = props?.formData?.promoVideo;
        console.log(PromoVideoUrl)
      useEffect(() => { 
        form.setFieldsValue(props.formData);
      },[props.formData])
    
    
      const onFormUpdate = (e:Partial<Types.CourseLandingPage>) => {
        props.onFormUpdate({
          ...props.formData,
          ...e
        })
      };

      return (
        <Fragment>
           <Form onValuesChange={onFormUpdate} form={form} layout="vertical" autoComplete="off">

           <Form.Item  name='url' required label="Landing Page URL">
<Input       addonBefore="extremebi://"/>
            </Form.Item>
           <Form.Item name="description" required label="Description">
<Input/>
            </Form.Item>
            
            <Form.Item label="Promo Video" required>
          <MediaUpload
            width="300px"
            onUpload={({ url }) => {
              onFormUpdate({
                promoVideo:url
              })
              // setUrl(url)
            }}
            height="250px"
            renderItem={() => (
              <Button>{PromoVideoUrl ? 'Replace Video' : 'Upload Video'}</Button>
            )}
            url={PromoVideoUrl}
          />
          {PromoVideoUrl ? <MediaPlayer url={PromoVideoUrl} /> : null}
        </Form.Item>


              </Form></Fragment>)
        
    }
    
    export default CourseLandingPageEditor
    