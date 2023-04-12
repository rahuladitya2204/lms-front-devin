// @ts-nocheck
import 'react-quill/dist/quill.snow.css'
import './custom-style.css'

import ReactQuill, { Quill } from 'react-quill'
import { Space, Tag } from 'antd'

import { useRef } from 'react'

var BackgroundClass = Quill.import('attributors/class/background')
var ColorClass = Quill.import('attributors/class/color')
var SizeStyle = Quill.import('attributors/style/size')
Quill.register(BackgroundClass, true)
Quill.register(ColorClass, true)
Quill.register(SizeStyle, true)

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ['video'],
  ['image'],
  ['clean'] // remove formatting button
]

var Embed = Quill.import('blots/embed')

class TemplateMarker extends Embed {
  static create({ name, value, collection }) {
    console.log(value, 'eeeee')
    let node = super.create(value)

    node.setAttribute('class', 'variable-tag')
    //Set up the (Bootstrap) badge, and badge colour

    node.setAttribute('data-value', value)
    //The marker is the (hidden) template marker reference
    node.setAttribute('data-collection', collection)

    node.innerHTML = name
    //The title is what the user sees in their editor

    return node
  }

  static value(node) {
    return {
      value: node.getAttribute('data-value')
    }
  }
}

TemplateMarker.blotName = 'TemplateMarker'
TemplateMarker.tagName = 'span'

Quill.register({
  'formats/TemplateMarker': TemplateMarker
})

interface QuillEditorPropsI {
  value?: string;
  variables?: any;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const variables = [
  {
    name: 'Course Name',
    value: 'title',
    collection: 'course'
  }
]

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
    );

    quill.insertText(range.index + 1, ' ', Quill.sources.USER)
    //Add a space after the marker

    quill.setSelection(range.index + 2, Quill.sources.SILENT)
  }
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
