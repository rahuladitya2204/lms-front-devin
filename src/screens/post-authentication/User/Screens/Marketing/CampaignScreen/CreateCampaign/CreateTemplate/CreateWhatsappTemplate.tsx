import { Button, Col, Divider, Form, Input, Row } from "antd";
import { Types, User } from "@adewaskar/lms-common";

import PreviewWhatsappTemplate from "@User/Screens/Marketing/Templates/Whatsapp/WhatsappTemplateEditor/PreviewWHatsappTemplate/PreviewTemplate";
import TextArea from "@Components/Textarea";
import { deepPatch } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import { useLayoutEffect } from "react";

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
    const content = useWatch(['whatsapp','body'], form);
    return <>
        <Row gutter={[20,20]}>
            <Col span={12}>
                <Button loading={loadingCampaign} onClick={() => {
                    generateContent({
                        title: props.campaign.title,
                        description: props.campaign.description,
                        channel: [`whatsapp`]
                    }, {
                        onSuccess: ({ data: { subject, content } }) => {
                            const D = {
                                whatsapp: {
                                    subject,
                                    body: content
                                }
                            };
                            console.log(subject,content,'aaaa')
                            form.setFieldsValue(D)
                            form.setFieldsValue(D);
                            onValuesChange(D)

                        }
                    })
                }}>Generate with AI</Button> <Divider/>
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