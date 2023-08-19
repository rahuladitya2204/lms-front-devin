// @ts-nocheck
import './quill.css'
import './custom-style.css'

import { Form, Spin } from 'antd'
import { addImageUpload, createVariablesButton } from './setup'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Common } from '@adewaskar/lms-common'
import ReactQuill from 'react-quill'
import { useToken } from 'antd/es/theme/internal'

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  // ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  ['video'],
  ['image'],
  ['link']
]

interface QuillEditorPropsI {
  value?: string;
  name?: string | string[];
  style?: {};
  variables?: any;
  type?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

function QuillEditor(props: QuillEditorPropsI) {
  const { token } = useToken()
  const form = Form.useFormInstance()
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles()
  const [inited, setInited] = useState(false)
  const quillRef = useRef(null)
  useEffect(
    () => {
      const quill = quillRef?.current?.getEditor()
      if (quill && props?.variables?.length && !inited) {
        setInited(true)
        createVariablesButton(quill, props.variables || [])
        addImageUpload(quill, uploadFiles)
      }
    },
    [props.variables]
  )

  const customButtonHandler = useCallback(() => {
    const buttonText = prompt('Enter button text:')
    const buttonLink = prompt('Enter button link:')
    const buttonColor = token?.colorPrimary || 'green'

    if (buttonText && buttonLink && buttonColor) {
      const buttonData = {
        text: buttonText,
        href: buttonLink,
        color: buttonColor
      }

      const quill = quillRef.current.getEditor()
      const range = quill.getSelection(true)

      quill.insertEmbed(range.index, 'customButton', buttonData, 'user')
      quill.setSelection(range.index + 1, 'user')
    }
  }, [])
  const value = Form.useWatch(props.name, form)
  return (
    <Spin spinning={loading} tip="Loading">
      <ReactQuill
        style={props.style ? props.style : {}}
        defaultValue={props.defaultValue}
        ref={quillRef}
        modules={{
          toolbar: {
            container: props.type === 'text' ? [] : toolbarOptions,
            handlers: {
              customButton: customButtonHandler
            }
          },
          imageResize: {
            // module: ImageResize
            // Other options here
          }
        }}
        placeholder={props.placeholder || ''}
        theme="snow"
        value={value}
        onChange={e => {
          const sanitizedHtmlString = e.replace(/&zwj;|&nbsp;/g, '')
          form.setFieldValue(props.name, sanitizedHtmlString)
        }}
      />
    </Spin>
  )
}

export default QuillEditor
