import {
  Button,
  Divider,
  Form,
  Input,
  Space,
  Switch,
  Tag,
  Typography,
} from 'antd'
import { Fragment, useEffect } from 'react'

import QuillEditor from '@Components/QuillEditor';
import { Types } from '@adewaskar/lms-common'

const { Title} = Typography;
const { useWatch} = Form;    
    interface CourseAdvancedSettingsPropsI {
        formData: Types.CourseAdvancedSetting;
        courseId: string;
      onFormUpdate: (d: Types.CourseAdvancedSetting) => void;
    }
    
    function CourseAdvancedSettings(props:CourseAdvancedSettingsPropsI) {
      const [form] = Form.useForm<Types.CourseAdvancedSetting>();    
      useEffect(() => {
        form.setFieldsValue(props.formData);
      },[props.formData])
    
      const sendEmail = useWatch(['email','enabled'], form);
      return (
        <Fragment>
          <Typography.Title level={4} >Variables</Typography.Title>
             <Space size={[0, 8]} wrap>
      <Tag color="default">magenta</Tag>
      <Tag color="default">red</Tag>
      <Tag color="default">volcano</Tag>
      <Tag color="default">purple</Tag>
    </Space>
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
     {/* <Button type='primary' danger >Delete Course</Button> */}
    </Form.Item>
          </Form>
        </Fragment>)
        
    }
    
    export default CourseAdvancedSettings
    