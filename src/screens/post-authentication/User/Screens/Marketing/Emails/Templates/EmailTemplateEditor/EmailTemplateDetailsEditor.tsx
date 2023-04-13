import BASE_EMAIL_TEMPLATE, { CreateBaseTemplate } from '../../BaseEmailTemplate';
import { Form, Input, Space, Tag, Typography, } from 'antd';
import React, { Fragment, useEffect } from 'react';
import { Store, Types } from '@adewaskar/lms-common'

import { EmailTypeMap } from '../Constant';
import QuillEditor from '@Components/QuillEditor';

const {Text } = Typography;

interface CreateEmailTemplateComponentPropsI {
  formData: Types.EmailTemplate;
  onFormUpdate: (d:Partial<Types.EmailTemplate>)=>void;}

const EmailTemplateDetailsEditor: React.FC<CreateEmailTemplateComponentPropsI> = (props) => {
  // const { organisation } = Store.useGlobal(s => s);
  // const BaseTemplate = CreateBaseTemplate(organisation);
  const emailTemplate = props.formData;
  const [form] = Form.useForm<Types.EmailTemplate>();
  useEffect(() => {
    form.setFieldsValue(props.formData);
  }, [props.formData]);

  const MailType = EmailTypeMap[emailTemplate.emailType] ? EmailTypeMap[emailTemplate.emailType] : {};

  const variables = MailType.variables;

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
        <Space direction='vertical' size={[30,30]}>
        <Form.Item name="subject" label="Subject of the email" required>
          <QuillEditor type='text' variables={variables}
            onChange={e => props.onFormUpdate({ subject: e })}
            value={props.formData.subject}
          />
        </Form.Item>
        <Form.Item name="content" label="Body of the email" required>
          <QuillEditor variables={variables}
            onChange={e => props.onFormUpdate({ content: e })}
            value={props.formData.content}
          />
        </Form.Item>
        </Space>
      </Form>
    </Fragment>
  );
};

export default EmailTemplateDetailsEditor;