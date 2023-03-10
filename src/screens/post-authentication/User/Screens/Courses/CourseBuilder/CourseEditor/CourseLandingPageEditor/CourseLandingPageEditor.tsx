import {
    Form,
    Input,
} from 'antd'
import { Fragment, useEffect } from 'react'

import { Types } from '@adewaskar/lms-common'

interface CourseLandingPageEditorPropsI {
        formData: Types.CourseLandingPage;
        courseId: string;
      onFormUpdate: (d:Types.CourseLandingPage)=>void;
    }
    
    function CourseLandingPageEditor(props:CourseLandingPageEditorPropsI) {
      const [form] = Form.useForm<Types.CourseLandingPage>();    
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
            
            <Form.Item required label="Promo Video">
            {/* <MediaPlayer width={500} url={props.formData.promoVideo } /> */}
    </Form.Item>


              </Form></Fragment>)
        
    }
    
    export default CourseLandingPageEditor
    