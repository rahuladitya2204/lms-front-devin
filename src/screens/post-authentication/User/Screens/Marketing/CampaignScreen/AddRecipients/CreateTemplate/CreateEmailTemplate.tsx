import { Form, Tag } from "antd";

import QuillEditor from "@Components/QuillEditor";

interface CreateEmailTemplatePropsI {

}

const variables = [{ name: 'Course Name', value: 'course.title'}, { name: 'Learner Name', value: 'learner.name'}];

const CreateEmailTemplate = () => {
    return <>
        <Form.Item name={['email','subject']} label="Email Subject" required>
            <QuillEditor name={['email','subject']} type="text" variables={variables} />
        </Form.Item>
        <Form.Item  name={['email','template']}  label="Email Body" required>
            <QuillEditor name={ ['email','template']} variables={variables}  />
        </Form.Item>
    </>;
}

export default CreateEmailTemplate;