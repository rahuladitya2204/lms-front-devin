import { Constants } from "@adewaskar/lms-common";
import { Form, Select } from "antd";

interface SelectLanguagePropsI {
    multiple?: boolean;
    name: string | string[];
    required?: boolean;
    languages?: string[];
}

export default function SelectLanguage(props: SelectLanguagePropsI) {
    const form = Form.useFormInstance();
    const language = Form.useWatch(Array.isArray(props.name) ? props.name : [props.name], form)
    return <Form.Item
        rules={[{ required: props.required }]}
        label="Select Language"
        name={props.name}
    >
        <Select
            mode={props.multiple ? 'multiple' : undefined}
            placeholder="Select your preferred Language"
            options={Constants.LANGUAGES
                .filter((lang) =>
                    props.languages ? props.languages.includes(lang.value) : true
                )
                .map((l) => {
                    return {
                        label: l.label,
                        value: l.value,
                    };
                })}
        />
    </Form.Item>
}