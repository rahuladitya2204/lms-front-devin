import { Form, Tag } from "antd";

import QuillEditor from "@Components/QuillEditor";
import { Types } from "@adewaskar/lms-common";

interface CreateEmailTemplatePropsI {
    form: any;
    data: Partial<Types.Campaign>;
}

const variables = [{ name: 'Course Name', value: 'course.title'}, { name: 'Learner Name', value: 'learner.name'}];

const CreateEmailTemplate = ({form,data}:CreateEmailTemplatePropsI) => {
    return <>
          <Form.Item name="subject" label="Email Subject" required>
            <QuillEditor type="text" variables={variables} onChange={e => form.setFieldsValue({
                subject: e
            })} value={data.subject} />
        </Form.Item>
        <Form.Item name="template" label="Email Body" required>
            <QuillEditor variables={variables} onChange={e => form.setFieldsValue({
                template: e
            })} value={data.template} />
        </Form.Item>
    </>;
}

export default CreateEmailTemplate;