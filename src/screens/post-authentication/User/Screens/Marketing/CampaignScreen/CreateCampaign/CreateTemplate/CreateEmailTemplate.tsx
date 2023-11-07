import { Button, Col, Divider, Form, Input, Row } from "antd";
import { Types, User } from "@adewaskar/lms-common";

import PreviewTemplate from "@User/Screens/Marketing/Templates/Emails/EmailTemplateEditor/PreviewTemplate";
import TextArea from "@Components/Textarea";
import { deepPatch } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import { useLayoutEffect } from "react";

const { useWatch } = Form;

interface CreateEmailTemplatePropsI {
    campaign: Types.Campaign;
    updateCampaign: (d: Types.Campaign) => void;
}

// const variables = [{ name: 'Course Name', value: 'course.title'}, { name: 'Learner Name', value: 'learner.name'}];

const CreateEmailTemplate = (props:CreateEmailTemplatePropsI) => {
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
    const content = useWatch(['email','body'], form);
    return <>
        <Row gutter={[20,20]}>
            <Col span={12}>
                <Button loading={loadingCampaign} onClick={() => {
                    generateContent({
                        title: props.campaign.title,
                        description: props.campaign.description,
                        channel: [`email`]
                    }, {
                        onSuccess: ({ data }) => {
                            const D = {
                                email: {
                                    body: data.content,
                                    subject: data.subject
                                }
                            };
                            console.log(data,'aaaa')
                            form.setFieldsValue(D);
                            onValuesChange(D)
                        }
                    })
                }}>Generate with AI</Button> <Divider/>
            <Form onValuesChange={onValuesChange} form={form} layout="vertical">
        <Form.Item label="Subject"  name={['email','subject']} required>
           <TextArea />
        </Form.Item>
        <Form.Item  name={['email','body']}  label="Email Body" required>
                <TextArea html  name={['email','body']}  />
        </Form.Item>
        </Form>
            </Col>
            <Col span={12}>
                <PreviewTemplate htmlContent={content} />
            </Col>
           </Row>
        </>
}

export default CreateEmailTemplate;