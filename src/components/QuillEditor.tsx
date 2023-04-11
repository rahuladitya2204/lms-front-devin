import 'react-quill/dist/quill.snow.css'

import ReactQuill, { Quill } from 'react-quill'

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
interface QuillEditorPropsI {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

function QuillEditor(props: QuillEditorPropsI) {
  return (
    <ReactQuill
      modules={{
        toolbar: toolbarOptions
      }}
      placeholder={props.placeholder || ''}
      theme="snow"
      value={props.value}
      onChange={props.onChange}
    />
  )
}

export default QuillEditor
