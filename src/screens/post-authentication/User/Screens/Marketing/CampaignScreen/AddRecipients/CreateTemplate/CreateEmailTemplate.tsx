import { Form, Tag } from "antd";

import HtmlEditor from "@Components/HtmlEditor";
import QuillEditor from "@Components/QuillEditor";
import SunEditorComponent from "@Components/SunEditor/SunEditor";

interface CreateEmailTemplatePropsI {

}

const variables = [{ name: 'Course Name', value: 'course.title'}, { name: 'Learner Name', value: 'learner.name'}];

const CreateEmailTemplate = () => {
    return <>
        <Form.Item name={['email','subject']} label="Email Subject" required>
            <HtmlEditor name={['email','subject']} type="text" variables={variables} />
        </Form.Item>
        <Form.Item  name={['email','template']}  label="Email Body" required>
            <SunEditorComponent name={['email','template']}  />
        </Form.Item>
    </>;
}

export default CreateEmailTemplate;