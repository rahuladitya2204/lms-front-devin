import { Card, Col, Form, Input, Row, Space, Typography, } from 'antd';
import { Common, Store, Types, User } from '@adewaskar/lms-common';
import React, { Fragment } from 'react';

import HtmlViewer from '@Components/HtmlViewer/HtmlViewer';
import { useParams } from 'react-router';

const { Text,Title } = Typography;

interface CreateEmailTemplateComponentPropsI {
  htmlContent: string;
  id?: string;
}

const PreviewTemplate: React.FC<CreateEmailTemplateComponentPropsI> = (props) => {
  const {data:organisation} = Common.Queries.useGetOrgDetails();
  const { id } = useParams();
  const templateId = props.id || id;
  const { data: template } = User.Queries.useGetEmailTemplateDetails(templateId+'');
  // const { useWatch } = Form;
  const form = Form.useFormInstance<Types.EmailTemplate>();
    const {data: BaseTemplate }=User.Queries.useGetBaseTemplates('transaction')
  // const subject = useWatch(['subject'], form);
  // const content = useWatch(['content'], form);
  const { data: { EmailTemplatesMap } } = Common.Queries.useGetAppConfig('user');
  // const MailType = EmailTemplatesMap[template.emailType] ? EmailTemplatesMap[template.emailType] : {};
  // const variables = MailType.variables;
    
    const compiled=BaseTemplate.replace('{{{template}}}',props.htmlContent).replace('{{organisation.logo}}',organisation.logo).replace('{{organisation.name}}',organisation.name)
    
  return (

          <div className='sun-editor-editable' style={{width:'100%'}}>
          <HtmlViewer content={compiled} />
          </div>

  );
};

export default PreviewTemplate;