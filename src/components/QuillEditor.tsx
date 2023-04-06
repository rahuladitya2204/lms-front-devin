import 'react-quill/dist/quill.snow.css'

import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'

interface QuillEditorPropsI {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

function QuillEditor(props: QuillEditorPropsI) {
  const editorRef = useRef({
    getContent: () => {}
  })
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef?.current?.getContent())
    }
  }
  return (
    <Editor
      value={props.value}
      onEditorChange={props.onChange}
      apiKey="7uza30ppp9crzjzjh4latjgf2xfxd8ozj6kgw3qwsfuuexxw"
      onInit={(evt, editor) => (editorRef.current = editor)}
      // initialValue="<p>This is the initial content of the editor.</p>"
      init={{
        height: 500,
        menubar: false,
        plugins:
          'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tableofcontents footnotes mergetags autocorrect typography inlinecss',
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
    />
  )
}

export default QuillEditor
