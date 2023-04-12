import BASE_EMAIL_TEMPLATE, { CreateBaseTemplate } from '../../BaseEmailTemplate';
import { Form, Input, Space, Tag, Typography, } from 'antd';
import React, { Fragment, useEffect } from 'react';
import { Store, Types } from '@adewaskar/lms-common'

import { EmailTypeMap } from '../Constant';
import QuillEditor from '@Components/QuillEditor';

const {Text } = Typography;
const VARIABLES = [
  {
    label: 'Course Title',
    value: 'course.title'
  },
  {
    label: 'Course Instructor',
    value: 'course.instructor.name'
  },
  {
    label: 'Learner Name',
    value: 'title'
  }, {
    label: 'Course Release Date',
    value:'course.enrolledAt'
  }
];

interface CreateEmailTemplateComponentPropsI {
  formData: Types.EmailTemplate;
  onFormUpdate: (d:Partial<Types.EmailTemplate>)=>void;}

const EmailTemplateDetailsEditor: React.FC<CreateEmailTemplateComponentPropsI> = (props) => {
  const { organisation } = Store.useGlobal(s => s);
  const BaseTemplate = CreateBaseTemplate(organisation);
  const emailTemplate = props.formData;
  const [form] = Form.useForm<Types.EmailTemplate>();
  useEffect(() => {
    form.setFieldsValue(props.formData);
  }, [props.formData]);

  const MailType = EmailTypeMap[emailTemplate.emailType] ? EmailTypeMap[emailTemplate.emailType] : {};
  console.log(props.formData,'MailType')
  return (
    <Fragment>
      <Form onValuesChange={props.onFormUpdate} form={form} layout="vertical" autoComplete="off">
      {emailTemplate.type==='default'?<><Form.Item label="Email Type" >
         <Text> {MailType.title}</Text>
        </Form.Item>
        <Form.Item label="Description" >
         <Text> {MailType.description}</Text>
        </Form.Item></>:<Form.Item label="Template Title" >
         <Text> {emailTemplate.title}</Text>
        </Form.Item>}
      <Form.Item name="subject" label="Email Subject" required>
          <Input placeholder="Subject of the email" />
        </Form.Item>
        <Form.Item name="content" label="Body of the email" required>
        <Space size={[0, 8]} wrap style={{marginBottom:20}}>
            <Text style={{marginRight:10}}>Variables:</Text><Space>
            {emailTemplate.variables.map(variable => {
              return variable.values.map(variable=><Tag color="default">{variable.title}</Tag>)
            })}
            </Space>

    </Space>
          <QuillEditor
            onChange={e => props.onFormUpdate({ content: e })}
            value={props.formData.content}
            // defaultValue={BASE_EMAIL_TEMPLATE}
          />
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default EmailTemplateDetailsEditor;