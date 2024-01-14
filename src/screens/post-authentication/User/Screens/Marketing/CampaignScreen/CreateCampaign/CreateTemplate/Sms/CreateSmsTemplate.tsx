import { Button, Col, Divider, Form, Input, Popover, Row } from "antd";
import { Types, User } from "@adewaskar/lms-common";
import { useLayoutEffect, useState } from "react";

import GenerateWithAi from "../GenerateWithAi";
import PreviewSmsTemplate from "@User/Screens/Marketing/Templates/Sms/PreviewSmsTemplate";
import TextArea from "@Components/Textarea";
import { deepPatch } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";

const { useWatch } = Form;

interface CreateSmsTemplatePropsI {
    campaign: Types.Campaign;
    updateCampaign: (d: Types.Campaign) => void;
}

// const variables = [{ name: 'Course Name', value: 'course.title'}, { name: 'Learner Name', value: 'learner.name'}];

const CreateSmsTemplate = (props:CreateSmsTemplatePropsI) => {
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
    const content = useWatch(['sms','body'], form);
    return <>
        <Row gutter={[20,20]}>
            <Col span={12}>
            <GenerateWithAi channel="sms" campaign={props.campaign} onComplete={D => {
                    form.setFieldsValue({
                          sms:D
                      });
                    onValuesChange({
                          sms: D
                      })
                }} />
                <Divider />
            <Form onValuesChange={onValuesChange} form={form} layout="vertical">
        {/* <Form.Item name={['sms','subject']} required>
           <TextArea label="Subject" name={['sms','subject']} />
        </Form.Item> */}
        <Form.Item  name={['sms','body']}  label="Sms Body" required>
                <TextArea name={['sms','body']}  />
        </Form.Item>
        </Form>
            </Col>
            <Col span={12}>
                <PreviewSmsTemplate content={content} />
            </Col>
           </Row>
        </>
}

export default CreateSmsTemplate;