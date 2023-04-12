import { Form, Tag } from "antd";

import QuillEditor from "@Components/QuillEditor";

interface CreateEmailTemplatePropsI {
    form: any;
    data: any;
}

const variables = [{ name: 'Course Name', value: 'course.title'}, { name: 'Learner Name', value: 'learner.name'}];

const CreateEmailTemplate = ({form,data}:CreateEmailTemplatePropsI) => {
    return <>
        <Form.Item name="template" label="Template" required>
            <QuillEditor variables={variables} onChange={e => form.setFieldsValue({
                template: e
            })} value={data?.template} />
        </Form.Item>
    </>;
}

export default CreateEmailTemplate;