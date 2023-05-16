import { Col, Form, Row } from "antd";

import PreviewTemplate from "@User/Screens/Marketing/Templates/Emails/EmailTemplateEditor/PreviewTemplate";
import SunEditorComponent from "@Components/SunEditor/SunEditor";
import TextArea from "@Components/Textarea";
import { Types } from "@adewaskar/lms-common";
import { deepPatch } from "@User/Screens/Courses/CourseBuilder/utils";
import { useLayoutEffect } from "react";

const { useWatch } = Form;

interface CreateEmailTemplatePropsI {
    campaign: Types.Campaign;
    updateCampaign: (d: Types.Campaign) => void;
}

// const variables = [{ name: 'Course Name', value: 'course.title'}, { name: 'Learner Name', value: 'learner.name'}];

const CreateEmailTemplate = (props:CreateEmailTemplatePropsI) => {
    const [form] = Form.useForm();
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
            <Form onValuesChange={onValuesChange} form={form} layout="vertical">
        <Form.Item name={['email','subject']} required>
           <TextArea label="Subject" name={['email','subject']} />
        </Form.Item>
        <Form.Item  name={['email','body']}  label="Email Body" required>
                <SunEditorComponent  name={['email','body']}  />
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