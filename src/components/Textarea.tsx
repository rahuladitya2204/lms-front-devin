import React from 'react'
import { Form, Input } from 'antd'
import SunEditorComponent from './SunEditor/SunEditor'

const { TextArea: AntDTextArea } = Input

interface TextAreaProps {
  height?: number;
  width?: number;
  name?: string | string[];
  value?: string;
  onChange?: (d: string) => void;
  label?: string;
  defaultValue?: string;
  readOnly?: boolean;
  placeholder?: string;
  html?: { level: number } | boolean;
}

const TextArea: React.FC<TextAreaProps> = props => {
  const { html = { level: 2 }, name, label, ...restProps } = props

  return (
    <Form.Item name={name} label={label}>
      {html ? (
        <SunEditorComponent
          // @ts-ignore
          level={props?.html?.level || 2}
          readOnly={props.readOnly}
          {...restProps}
        />
      ) : (
        // @ts-ignore
        <AntDTextArea
          placeholder={props.placeholder}
          readOnly={props.readOnly}
          {...restProps}
        />
      )}
    </Form.Item>
  )
}

export default TextArea
