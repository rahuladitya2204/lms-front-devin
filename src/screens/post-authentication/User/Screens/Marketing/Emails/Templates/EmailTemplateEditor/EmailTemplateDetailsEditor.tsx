// @ts-nocheck

import { Common, Types, User } from '@adewaskar/lms-common';
import { Form, Space, Typography, } from 'antd';
import React, { Fragment } from 'react';

import HtmlEditor from '@Components/HtmlEditor';
import QuillEditor from '@Components/QuillEditor';
import { useParams } from 'react-router';

const { Text } = Typography;

interface CreateEmailTemplateComponentPropsI {
  id?: string;
}

const EmailTemplateDetailsEditor: React.FC<CreateEmailTemplateComponentPropsI> = (props) => {
  const { id } = useParams();
  const templateId = props.id || id;
  const { data: template } = User.Queries.useGetEmailTemplateDetails(templateId);
  const { useWatch } = Form;
  const form = Form.useFormInstance<Types.EmailTemplate>();

  const subject = useWatch(['subject'], form);
  const content = useWatch(['content'], form);
  const { data: { EmailTemplatesMap } } = Common.Queries.useGetAppConfig('user');
  const MailType = EmailTemplatesMap[template.emailType] ? EmailTemplatesMap[template.emailType] : {};
  const variables = MailType.variables;
  

  return (
    <Fragment>
      {template.type==='default'?<><Form.Item label="Email Type" >
         <Text> {MailType.title}</Text>
        </Form.Item>
        <Form.Item label="Description" >
         <Text> {MailType.description}</Text>
        </Form.Item></>:<Form.Item label="Template Title" >
         <Text> {template.title}</Text>
        </Form.Item>}
        <Space direction='vertical' size={[30,30]}>
        <Form.Item name="subject" label="Subject of the email" required>
          {/* <QuillEditor name="subject" type='text' variables={variables}
            onChange={e => form.setFieldValue(['subject'],e)}
            value={subject}
          /> */}
           <HtmlEditor variables={variables} onChange={e => form.setFieldValue(['subject'],e)}
            defaultValue={subject}/>

        </Form.Item>
        <Form.Item name="content" label="Body of the email" required>
        <HtmlEditor variables={variables} onChange={e => form.setFieldValue(['content'],e)}
            defaultValue={content}/>
        </Form.Item>
        </Space>
    </Fragment>
  );
};

export default EmailTemplateDetailsEditor;