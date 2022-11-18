import {
  Button,
  Divider,
    Form, Input, Switch, Typography,
    } from 'antd'
    import { Fragment, useEffect } from 'react'
    import QuillEditor from '@Components/QuillEditor';
    import {  CourseAdvancedSetting } from '@Types/Courses.types';
const { Title} = Typography;
const { useWatch} = Form;    
    interface CourseAdvancedSettingsPropsI {
        formData: CourseAdvancedSetting;
        courseId: string;
      onFormUpdate: (d: CourseAdvancedSetting) => void;
    }
    
    function CourseAdvancedSettings(props:CourseAdvancedSettingsPropsI) {
      const [form] = Form.useForm<CourseAdvancedSetting>();    
      useEffect(() => {
        form.setFieldsValue(props.formData);
      },[props.formData])
    
      const sendEmail = useWatch(['email','enabled'], form);
      return (
        <Fragment>
           <Form onValuesChange={(e,v)=>props.onFormUpdate(v)} form={form} layout="vertical" autoComplete="off">
        <Title level={3}>Email Notification</Title>
           <Form.Item name={["email",'enabled']} label="Send email to learner on course enrollment.">
                  <Switch defaultChecked />
                  </Form.Item>
            {sendEmail ? <Fragment>
              <Form.Item name={["email",'subject']} label="Email Subject">
                  <Input />
            </Form.Item>
            
            <Form.Item name={["email",'cc']} label="Add Cc">
                  <Input />
                  </Form.Item>
    <Form.Item  name={["email",'content']} required label="Description">
      <QuillEditor value=''/>
    </Form.Item>
             </Fragment>  :null}     
                 
            <Divider plain ></Divider>
            <Form.Item>
     <Button type='primary' danger >Delete Course</Button>
    </Form.Item>
          </Form>
        </Fragment>)
        
    }
    
    export default CourseAdvancedSettings
    