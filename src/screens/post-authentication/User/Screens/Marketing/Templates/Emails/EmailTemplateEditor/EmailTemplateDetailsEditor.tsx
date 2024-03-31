// @ts-nocheck

import { Col, Form, Input, Row, Space, } from 'antd';
import { Common, Types, User } from '@adewaskar/lms-common';
import React, { Fragment } from 'react';

import PreviewTemplate from './PreviewTemplate';
import TextArea from '@Components/Textarea';
import { Typography } from '@Components/Typography';
import { useParams } from '@Router/index';

;

const { Text,Title } = Typography;

interface CreateEmailTemplateComponentPropsI {
  id?: string;
}

const EmailTemplateDetailsEditor: React.FC<CreateEmailTemplateComponentPropsI> = (props) => {
  const { id } = useParams();
  const templateId = props.id || id;
  const { data: template,isFetching: loadingTemplate } = User.Queries.useGetEmailTemplateDetails(templateId);
  const { useWatch } = Form;
  const form = Form.useFormInstance<Types.EmailTemplate>();

  const subject = useWatch(['subject'], form);
  const content = useWatch(['content'], form);
  const { data: { EmailTemplatesMap },isFetching: loadingTemplates } = Common.Queries.useGetAppConfig('user');
  const MailType = EmailTemplatesMap[template.emailType] ? EmailTemplatesMap[template.emailType] : {};
  const variables = MailType.variables;
  
  const isFetching=loadingTemplates || loadingTemplate

  return (
    <Row gutter={[20,20]}>
      <Col span={12}>
      <Fragment>
      {template.type === 'default' ? <><Form.Item label={<Title style={{margin:0}} level={5} strong>Email Type</Title> } >
         <Text> {MailType.title}</Text>
        </Form.Item>
        <Form.Item label={<Title style={{margin:0}} level={5} strong>Description</Title> }  >
         <Text> {MailType.description}</Text>
        </Form.Item></>:<Form.Item label="Template Title" >
         <Text> {template.title}</Text>
        </Form.Item>}
        <Space direction='vertical' size={[30,30]} style={{width:'100%'}}>
        <Form.Item name="subject"  label="Subject of the email" required>
          <TextArea height={150} name={'subject'} html={{level: 1}} />


        </Form.Item>
        <Form.Item name="content" label="Body of the email" required>
        <TextArea html={{level:3}}
              variables={variables}
              name={['content']}
            />
        </Form.Item>
        </Space>
    </Fragment>
      </Col>
      <Col span={12}>
        <PreviewTemplate htmlContent={ content} /></Col>
    </Row>
  );
};

export default EmailTemplateDetailsEditor;