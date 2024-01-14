import { Button, Col, Divider, Form, Input, Popover, Row } from "antd";
import { Types, User } from "@adewaskar/lms-common";
import { useLayoutEffect, useState } from "react";

import GenerateWithAi from "../GenerateWithAi";
import PreviewWhatsappTemplate from "@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplateEditor/PreviewWHatsappTemplate/PreviewTemplate";
import TextArea from "@Components/Textarea";
import { deepPatch } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";

const { useWatch } = Form;

interface CreateWhatsappTemplatePropsI {
    campaign: Types.Campaign;
    updateCampaign: (d: Types.Campaign) => void;
}

// const variables = [{ name: 'Course Name', value: 'course.title'}, { name: 'Learner Name', value: 'learner.name'}];

const CreateWhatsappTemplate = (props:CreateWhatsappTemplatePropsI) => {
    const [form] = Form.useForm<Types.CreateCampaignPayload>();
    const { mutate: generateContent,isLoading: loadingCampaign} = User.Queries.useGenerateCampaignContent();
    useLayoutEffect(
        () => {
            form.setFieldsValue(props.campaign)
        },
        [[props.campaign]]
    );
    const onValuesChange = (d: any) => {
        const data = deepPatch({...props.campaign}, d)
        props.updateCampaign(data)
    };
    const [prompt, setPrompt] = useState('');
    const content = useWatch(['whatsapp','body'], form);
    return <>
        <Row gutter={[20,20]}>
            <Col span={12}>
            <GenerateWithAi channel="whatsapp" campaign={props.campaign} onComplete={D => {
                    form.setFieldsValue({
                          whatsapp:D
                      });
                    onValuesChange({
                          whatsapp: D
                      })
                }} />
                <Divider />
            <Form onValuesChange={onValuesChange} form={form} layout="vertical">
        <Form.Item name={['whatsapp','subject']} required>
           <TextArea label="Subject" name={['whatsapp','subject']} />
        </Form.Item>
        <Form.Item  name={['whatsapp','body']}  label="Whatsapp Body" required>
                <TextArea html name={['whatsapp','body']}  />
        </Form.Item>
        </Form>
            </Col>
            <Col span={12}>
                <PreviewWhatsappTemplate content={content} />
            </Col>
           </Row>
        </>
}

export default CreateWhatsappTemplate;