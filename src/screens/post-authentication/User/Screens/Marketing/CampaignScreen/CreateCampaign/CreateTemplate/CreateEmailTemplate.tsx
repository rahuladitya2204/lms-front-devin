import { Form, Tag } from "antd";

import HtmlEditor from "@Components/HtmlEditor";
import SunEditorComponent from "@Components/SunEditor/SunEditor";
import { Types } from "@adewaskar/lms-common";
import { deepPatch } from "@User/Screens/Courses/CourseBuilder/utils";
import { useLayoutEffect } from "react";

interface CreateEmailTemplatePropsI {
    campaign: Types.Campaign;
    updateCampaign: (d: Types.Campaign) => void;
}

const variables = [{ name: 'Course Name', value: 'course.title'}, { name: 'Learner Name', value: 'learner.name'}];

const CreateEmailTemplate = (props:CreateEmailTemplatePropsI) => {
    const [form] = Form.useForm();
    useLayoutEffect(
        () => {
          form.setFieldsValue(props.campaign)
        },
        [[props.campaign]]
      )
    return <>
            <Form   onValuesChange={d => {
        const data = deepPatch(props.campaign, d)
        console.log(data, d, 1111)
        props.updateCampaign(data)
      }} form={form}>
<Form.Item name={['email','subject']} label="Email Subject" required>
            <HtmlEditor name={['email','subject']} type="text" variables={variables} />
        </Form.Item>
        <Form.Item  name={['email','template']}  label="Email Body" required>
            <SunEditorComponent name={['email','template']}  />
        </Form.Item>
        </Form>
        </>
}

export default CreateEmailTemplate;