import { Common, Types } from '@adewaskar/lms-common'
import { Form, Input, Spin, Switch, Tooltip } from 'antd'
import React, { Fragment, useState } from 'react'

import SunEditorComponent from './SunEditor/SunEditor'

const { TextArea: AntDTextArea } = Input

interface SunEditorPropsI {
  height?: number;
  width?: number;
  name?: string | string[];
  variables?: Types.Variable[];
  value?: string;
  onChange?: (d: string) => void;
    label?: string;
  defaultValue?: string;
  html?: boolean;
}

const TextArea = (props: SunEditorPropsI) => {
  const form = Form.useFormInstance();
  const [html, setHtml] = useState(false);
    return <Form.Item name={props.name} label={<>{props.label}   <Tooltip placement="topLeft" title={`HTML`}>
      <Switch onChange={e => {
        setHtml(e)
        form.resetFields(props.name as string[]);
     }} style={{ marginLeft: 10 }} size='small' defaultChecked />
    </Tooltip>
       </>} required>
    {html ? (
    <SunEditorComponent {...props} />
  ) : (
    // @ts-ignore
    <AntDTextArea {...props} />
  )}
  </Form.Item>
}
export default TextArea;
