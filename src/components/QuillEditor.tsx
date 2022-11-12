import 'react-quill/dist/quill.snow.css'

import ReactQuill from 'react-quill'

interface QuillEditorPropsI {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

function QuillEditor(props: QuillEditorPropsI) {
  return (
    <ReactQuill placeholder={props.placeholder || ''} theme="snow" value={props.value} onChange={props.onChange} />
  )
}

export default QuillEditor
