import { Button, Col, Divider, Form, Input, Popover, Row } from "antd";
import { Types, User } from "@invinciblezealorg/lms-common";
import { useLayoutEffect, useState } from "react";

import GenerateWithAi from "../GenerateWithAi";
import PreviewTemplate from "@User/Screens/Marketing/Templates/Emails/EmailTemplateEditor/PreviewTemplate";
import TextArea from "@Components/Textarea";
import { deepPatch } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";

const { useWatch } = Form;

interface CreateEmailTemplatePropsI {
    // campaign: Types.Campaign;
    // updateCampaign: (d: Types.Campaign) => void;
}

const variables = [{
    name: 'Learner Name',
    value:'params.learner.name'
  },{
    name: "Today's Date",
    value:'params.date'
  }]
const CreateEmailTemplate = (props:CreateEmailTemplatePropsI) => {
    const form = Form.useFormInstance();
    const content = useWatch(['email', 'body'], form);
    const campaign = Form.useWatch(form);
    return <>
        <Row gutter={[20,20]}>
            <Col span={12}>
                <GenerateWithAi channel="email" campaign={campaign} onComplete={D => {
                    form.setFieldValue(['recipients', 'segment', 'email'], D);
                }} />
               <Divider/>
            <>
                    <Form.Item
                          rules={[{ required: true, message: 'Please input the email subject!' }]}
                          label="Subject" name={['email', 'subject']} >
           <TextArea />
        </Form.Item>
        <Form.Item rules={[{ required: true, message: 'Please input the email body!' }]}  name={['email','body']}  label="Email Body" >
                <TextArea variables={variables} html={{level:3}}  name={['email','body']}  />
        </Form.Item>
        </>
            </Col>
            <Col span={12}>
                <PreviewTemplate htmlContent={content} />
            </Col>
           </Row>
        </>
}

export default CreateEmailTemplate;