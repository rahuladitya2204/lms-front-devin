import { Form, Tag } from "antd";

import QuillEditor from "@Components/QuillEditor";

interface CreateEmailTemplatePropsI {
    form: any;
    data: any;
}

const variables = [{ name: 'Course Name', value: 'title', collection: 'course' }, { name: 'Learner Name', value: 'name', collection: 'learner' }];

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