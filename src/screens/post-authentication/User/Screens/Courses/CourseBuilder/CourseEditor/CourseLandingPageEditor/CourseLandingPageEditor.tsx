import {
    Form, Input,
    } from 'antd'
    import { Fragment, useEffect } from 'react'
    import { CourseLandingPage } from '@Types/Courses.types';
import MediaPlayer from '@Components/MediaPlayer';
import MediaUpload from '@Components/MediaUpload';
    
    interface CourseLandingPageEditorPropsI {
        formData: CourseLandingPage;
        courseId: string;
      onFormUpdate: (d:CourseLandingPage)=>void;
    }
    
    function CourseLandingPageEditor(props:CourseLandingPageEditorPropsI) {
      const [form] = Form.useForm<CourseLandingPage>();    
      useEffect(() => {
        form.setFieldsValue(props.formData);
      },[props.formData])
    
    
      const onFormUpdate = (e:Partial<CourseLandingPage>) => {
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
              <MediaUpload width='300px' height='250px' renderItem={() => <MediaPlayer url={props.formData.promoVideo } />}  onUpload={({url}) => {
                onFormUpdate({
                  promoVideo: url
                });
          }} url={props.formData?.promoVideo} />
    </Form.Item>


              </Form></Fragment>)
        
    }
    
    export default CourseLandingPageEditor
    