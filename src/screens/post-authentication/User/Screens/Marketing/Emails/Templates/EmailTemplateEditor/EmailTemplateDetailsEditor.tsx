// @ts-nocheck

import { Common, Store, Types } from '@adewaskar/lms-common'
import { Form, Input, Space, Tag, Typography, } from 'antd';
import React, { Fragment, useEffect } from 'react';

import QuillEditor from '@Components/QuillEditor';

const {Text } = Typography;

interface CreateEmailTemplateComponentPropsI {
  template: Types.EmailTemplate;
}

const EmailTemplateDetailsEditor: React.FC<CreateEmailTemplateComponentPropsI> = (props) => {
  const { useWatch } = Form;
  const form = Form.useFormInstance<Types.EmailTemplate>();

  const template = props.template;

  const subject = useWatch(['subject'], form);
  const content = useWatch(['content'], form);
  const { data: { EmailTemplates: EmailTemplatesMap } } = Common.Queries.useGetAppConfig('user');
  console.log(EmailTemplatesMap,template.emailType,'lalal')
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
          <QuillEditor name="subject" type='text' variables={variables}
            onChange={e => form.setFieldValue(['subject'],e)}
            value={subject}
          />
        </Form.Item>
        <Form.Item name="content" label="Body of the email" required>
          <QuillEditor name="content" variables={variables}
            onChange={e => form.setFieldValue(['content'],e)}
            value={content}
          />
        </Form.Item>
        </Space>
    </Fragment>
  );
};

export default EmailTemplateDetailsEditor;