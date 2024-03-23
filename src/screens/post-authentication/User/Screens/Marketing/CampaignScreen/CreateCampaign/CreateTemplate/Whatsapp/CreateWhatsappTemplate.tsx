import { Button, Col, Divider, Form, Input, Popover, Row } from "antd";
import { Types, User } from "@Common";
import { useLayoutEffect, useState } from "react";

import GenerateWithAi from "../GenerateWithAi";
import PreviewWhatsappTemplate from "@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplateEditor/PreviewWHatsappTemplate/PreviewTemplate";
import TextArea from "@Components/Textarea";
import { deepPatch } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";

const { useWatch } = Form;

interface CreateWhatsappTemplatePropsI {
    // campaign: Types.Campaign;
    // updateCampaign: (d: Types.Campaign) => void;
}

// const variables = [{ name: 'Course Name', value: 'course.title'}, { name: 'Learner Name', value: 'learner.name'}];

const CreateWhatsappTemplate = (props:CreateWhatsappTemplatePropsI) => {
    const form = Form.useFormInstance();
    const content = useWatch(['recipients', 'segment','whatsapp','body'], form);
    const campaign = Form.useWatch(form);
    return <>
        <Row gutter={[20,20]}>
            <Col span={12}>
            <GenerateWithAi channel="whatsapp" campaign={campaign} onComplete={D => {
                   form.setFieldValue(['recipients', 'segment', 'whatsapp'], D);
                }} />
                <Divider />
            <>
        <Form.Item name={['whatsapp','subject']} rules={[{ required: true, message: 'Please input whatsapp subject!' }]}>
           <TextArea label="Subject" name={['whatsapp','subject']} />
        </Form.Item>
        <Form.Item  name={['whatsapp','body']}  label="Whatsapp Body" rules={[{ required: true, message: 'Please input whatsapp body!' }]}>
                <TextArea html name={['whatsapp','body']}  />
        </Form.Item>
        </>
            </Col>
            <Col span={12}>
                <PreviewWhatsappTemplate content={content} />
            </Col>
           </Row>
        </>
}

export default CreateWhatsappTemplate;