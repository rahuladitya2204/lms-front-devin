import { Form, Tag } from "antd";

import QuillEditor from "@Components/QuillEditor";

interface CreateEmailTemplatePropsI {
    form: any;
    data: any;
}

const CreateEmailTemplate = ({form,data}:CreateEmailTemplatePropsI) => {

    return <>
              
        <Form.Item label="Variables" >
            <Tag color="blue">Learner Name: {`{{name}}`}</Tag>
            <Tag color="blue">Contact No: {`{{contactNo}}`}</Tag>

        </Form.Item>
        <Form.Item name="template" label="Template" required>
            <QuillEditor onChange={e => form.setFieldsValue({
                template: e
            })} value={data?.template} />
        </Form.Item>
    </>;
}

export default CreateEmailTemplate;