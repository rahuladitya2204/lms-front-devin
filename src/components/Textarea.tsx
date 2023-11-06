import { Form, Input } from 'antd'

import { TextAreaProps as LibTextAreaProps } from 'antd/es/input'
import React from 'react'
import SunEditorComponent from './SunEditor/SunEditor'

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

const TextArea: React.FC<TextAreaProps> = props => {
  const { html, name, label, ...restProps } = props

  return (
    <Form.Item name={name} label={label}>
      {html ? (
        <SunEditorComponent
          // @ts-ignore
          level={typeof html === 'object' ? html.level : 2}
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
