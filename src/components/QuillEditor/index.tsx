// @ts-nocheck
import 'react-quill/dist/quill.snow.css'
import './custom-style.css'
import './setup'

import ReactQuill, { Quill } from 'react-quill'
import { Space, Tag } from 'antd'
import { useEffect, useRef } from 'react'

import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

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
  variables?: any;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}


function QuillEditor(props: QuillEditorPropsI) {
  const quillRef = useRef(null)
  const addVariable = variable => {
    const quill = quillRef?.current.getEditor()

    let range = quill.getSelection(true)

    quill.insertEmbed(
      range.index,
      //Insert the TemplateMarker in the same range as the cursor is

      'TemplateMarker',
      //This is the name of the Embed

      //   {
      // colour: `warning`,
      // marker:`first_name`,
      // title: `FIRST NAME`
      // }
      variable
      //These are the variable values to feed to the editor
    )

    quill.insertText(range.index + 1, ' ', Quill.sources.USER)
    //Add a space after the marker

    quill.setSelection(range.index + 2, Quill.sources.SILENT)
  }

  // useEffect(() => {
  //   const quill = quillRef?.current.getEditor()
  //   quill.on('text-change', function(delta, oldDelta, source) {
  //     var delta = quill.getContents()
  //     var qdc = new QuillDeltaToHtmlConverter(delta.ops, window.opts_ || {})
  //     qdc.renderCustomWith(function(customOp, contextOp) {
  //       if (customOp.insert.type === 'TemplateMarker') {
  //         let val = customOp.insert.value
  //         return val.value
  //       }
  //     })

  //     var html = qdc.convert()
  //     //Convert the Delta JSON to HTML

  //     //This is what will be used to render the template
  //     //You also need to store this in your DB
  //   })
  // }, [])

  return (
    <Space direction="vertical">
      <Space>
        {props.variables.map(variable => {
          return (
            <Tag onClick={e => addVariable(variable)} color="blue">
              {variable.name}
            </Tag>
          )
        })}
      </Space>

      <ReactQuill
        defaultValue={props.defaultValue}
        ref={quillRef}
        modules={{
          toolbar: toolbarOptions
        }}
        placeholder={props.placeholder || ''}
        theme="snow"
        value={props.value}
        onChange={props.onChange}
      />
    </Space>
  )
}

export default QuillEditor
