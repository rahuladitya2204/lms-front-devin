import { Form, Tag } from "antd";

import QuillEditor from "@Components/QuillEditor";
import { Types } from "@adewaskar/lms-common";

interface CreateEmailTemplatePropsI {
    form: any;
    data: Types.Campaign;
}

const variables = [{ name: 'Course Name', value: 'course.title'}, { name: 'Learner Name', value: 'learner.name'}];

const CreateEmailTemplate = ({form,data}:CreateEmailTemplatePropsI) => {
    return <>
        <Form.Item label="Email Subject" required>
            <QuillEditor name={['email','subject']} type="text" variables={variables} onChange={e => form.setFieldsValue({
                subject: e
            })} value={data.email.subject} />
        </Form.Item>
        <Form.Item  label="Email Body" required>
            <QuillEditor name={ ['email','template']} variables={variables} onChange={e => form.setFieldsValue({
                template: e
            })} value={data.email.template} />
        </Form.Item>
    </>;
}

export default CreateEmailTemplate;