// @ts-nocheck
import 'react-quill/dist/quill.snow.css'
import './custom-style.css'

import { addImageUpload, createVariablesButton } from './setup'
import { useEffect, useRef, useState } from 'react'

import { Common } from '@adewaskar/lms-common'
import { ImageResize } from 'quill-image-resize-module-ts'
import ReactQuill from 'react-quill'
import { Spin } from 'antd'

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
  ['custom']
]

interface QuillEditorPropsI {
  value?: string;
  style?: {};
  variables?: any;
  type?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

function QuillEditor(props: QuillEditorPropsI) {
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
  return (
    <Spin spinning={loading} tip="Loading">
      <ReactQuill
        style={props.style ? props.style : {}}
        defaultValue={props.defaultValue}
        ref={quillRef}
        modules={{
          toolbar: props.type === 'text' ? [] : toolbarOptions,
          imageResize: {
            // module: ImageResize
            // Other options here
          }
        }}
        placeholder={props.placeholder || ''}
        theme="snow"
        value={props.value}
        onChange={e => {
          const sanitizedHtmlString = e.replace(/&zwj;|&nbsp;/g, '')
          props.onChange(sanitizedHtmlString)
        }}
      />
    </Spin>
  )
}

export default QuillEditor
