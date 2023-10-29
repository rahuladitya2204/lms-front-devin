import React from 'react'
import { Form, Input } from 'antd'
import SunEditorComponent, { SunEditorPropsI } from './SunEditor/SunEditor'
import { TextAreaProps as LibTextAreaProps } from 'antd/es/input'

const { TextArea: AntDTextArea } = Input

// @ts-ignore
interface TextAreaProps extends LibTextAreaProps {
  height?: number;
  width?: number;
  name?: string | string[];
  value?: string;
  onChange?: (d: string) => void;
  label?: string;
  defaultValue?: string;
  onFocus?: () => void;
  readOnly?: boolean;
  placeholder?: string;
  html?: { level: number } | boolean;
  variables?: { value: string, name: string }[];
}

// interface ComProps extends SunEditorPropsI

const TextArea: React.FC<TextAreaProps> = props => {
  const { html = { level: 2 }, name, label, ...restProps } = props

  return (
    <Form.Item name={name} label={label}>
      {html ? (
        <TextArea
          html
          onFocus={props.onFocus}
          // @ts-ignore
          level={props?.html?.level || 2}
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
  )
}

export default TextArea
