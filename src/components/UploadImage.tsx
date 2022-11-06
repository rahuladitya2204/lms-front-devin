import 'react-quill/dist/quill.snow.css'

import ReactQuill from 'react-quill'

interface UploadImagePropsI {
    value: string;
    onChange?: (value: string) => void;
}

function UploadImage(props: UploadImagePropsI) {
  return <ReactQuill theme="snow" value={props.value} onChange={props.onChange} />
}

export default UploadImage
