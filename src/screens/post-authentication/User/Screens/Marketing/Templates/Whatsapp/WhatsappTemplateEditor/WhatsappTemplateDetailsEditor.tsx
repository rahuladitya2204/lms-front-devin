// @ts-nocheck

import { Common, Types, User } from '@adewaskar/lms-common';
import { Form, Space, } from 'antd';
import React, { Fragment } from 'react';

import TextArea from '@Components/Textarea';
import { Typography } from '@Components/Typography';
import { useParams } from 'react-router';

;

const { Text } = Typography;

interface CreateWhatsappTemplateComponentPropsI {
  id?: string;
}

const WhatsappTemplateDetailsEditor: React.FC<CreateWhatsappTemplateComponentPropsI> = (props) => {
  const { id } = useParams();
  const templateId = props.id || id;
  const { data: template } = User.Queries.useGetWhatsappTemplateDetails(templateId);
  const { useWatch } = Form;
  const form = Form.useFormInstance<Types.WhatsappTemplate>();

  const subject = useWatch(['subject'], form);
  const content = useWatch(['content'], form);
  const { data: { WhatsappTemplatesMap } } = Common.Queries.useGetAppConfig('user');
  const MailType = WhatsappTemplatesMap[template.whatsappType] ? WhatsappTemplatesMap[template.whatsappType] : {};
  const variables = MailType.variables;
  

  return (
    <Fragment>
      {template.type==='default'?<><Form.Item label="Whatsapp Type" >
         <Text> {MailType.title}</Text>
        </Form.Item>
        <Form.Item label="Description" >
         <Text> {MailType.description}</Text>
        </Form.Item></>:<Form.Item label="Template Title" >
         <Text> {template.title}</Text>
        </Form.Item>}
        <Space direction='vertical' size={[30,30]} style={{width:'100%'}}>
        <Form.Item name="subject" label="Subject of the whatsapp" required>
           <TextArea html variables={variables} name="subject"
          />

        </Form.Item>
        <Form.Item name="content" label="Body of the whatsapp" required>
        <TextArea html
              variables={variables}
              name={['content']}
            />
        </Form.Item>
        </Space>
    </Fragment>
  );
};

export default WhatsappTemplateDetailsEditor;