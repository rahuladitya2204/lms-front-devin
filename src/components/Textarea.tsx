import { Button, Form, Input } from "antd";

import SunEditorComponent from "./Editor/SunEditor/SunEditor";
// import CKEditorComponent from "./Editor/CKEditor/CKEditor";
import { TextAreaProps as LibTextAreaProps } from "antd/es/input";
import React from "react";
import { User } from "@adewaskar/lms-common";

const { TextArea: AntDTextArea } = Input;

// @ts-ignore
interface TextAreaProps extends LibTextAreaProps {
  height?: number;
  width?: number;
  uploadPrefixKey?: string;
  name?: string | string[];
  value?: string;
  modifyCta?: boolean;
  onChange?: (d: string) => void;
  label?: string;
  defaultValue?: string;
  onFocus?: () => void;
  readOnly?: boolean;
  placeholder?: string;
  editorType?: string;
  html?: { level: number } | boolean;
  variables?: { value: string; name: string }[];
}

const TextArea: React.FC<TextAreaProps> = (props) => {
  const { html, name, label, ...restProps } = props;
  const EditorComponent = SunEditorComponent;
  const { mutate: rephraseText } = User.Queries.useRephraseText();
  const form = Form.useFormInstance();
  // props.editorType === "ck" ? CKEditorComponent : SunEditorComponent;
  return (
    <Form.Item
      name={name}
      label={label}
    // extra={
    //   <Button
    //     onClick={() =>
    //       rephraseText(
    //         {
    //           html: true,
    //           text: restProps.value + "",
    //         },
    //         {
    //           onSuccess: (v) => {
    //             console.log(v, "vv");
    //             form.setFieldValue(name, v);
    //           },
    //         }
    //       )
    //     }
    //   >
    //     Rephrase Text
    //   </Button>
    // }
    >
      {html ? (
        <EditorComponent
          modifyCta={props.modifyCta}
          uploadPrefixKey={props.uploadPrefixKey}
          // @ts-ignore
          level={typeof html === "object" ? html.level : 2}
          readOnly={props.readOnly}
          {...restProps}
        />
      ) : (
        // @ts-ignore
        <AntDTextArea
          onFocus={props.onFocus}
          placeholder={props.placeholder}
          readOnly={props.readOnly}
          {...restProps}
        />
      )}
    </Form.Item>
  );
};

export default TextArea;
