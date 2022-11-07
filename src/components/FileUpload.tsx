import React, { Fragment, ReactNode, useState } from 'react'
import { Upload, UploadProps } from 'antd'

import { UploadFileType } from '../types/Common.types'
import { useUploadFiles } from '../network/Common/CommonQueries'

const UPLOAD: UploadProps = {
  onDrop(e) {
    // console.log('Dropped files', e.dataTransfer.files)
  }
}

interface FileUploadPropsI {
  onUpload: (files: UploadFileType[]) => void;
  children?: ReactNode;
}

const FileUpload: React.FC<FileUploadPropsI> = props => {
  const { mutate: uploadFiles } = useUploadFiles()
  const [files, setFiles] = useState<File[]>([])
  UPLOAD.customRequest = ({ file, onError, onSuccess, onProgress, data }) => {
    return uploadFiles({
      files,
      onSuccess: files => {
        props.onUpload(files)
        onSuccess && onSuccess(files)
      }
    })
  }
  UPLOAD.beforeUpload = (info) => {
    setFiles([info])
  }
  return (
    <Upload {...UPLOAD}>
      {props.children}
   </Upload>
    
  )
}

export default FileUpload
