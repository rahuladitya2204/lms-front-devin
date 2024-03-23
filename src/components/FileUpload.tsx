import { Common, Types } from '@invinciblezealorg/lms-common'
import React, { ReactNode, useState } from 'react'
import { Upload, UploadProps } from 'antd'

import styled from '@emotion/styled'

const CustomUpload = styled(Upload)`
.ant-upload.ant-upload-select {
  width: 100%;
}
`
const UPLOAD: UploadProps = {
  onDrop(e) {

  }
}

interface FileUploadPropsI {
  onUpload: (files: Types.UploadFileType[]) => void;
  children?: ReactNode;
  listType?: string;
  extra?: UploadProps;
}

const FileUpload: React.FC<FileUploadPropsI> = props => {
  const { mutate: uploadFiles } = Common.Queries.useUploadFiles()
  const [files, setFiles] = useState<File[]>([])
  UPLOAD.customRequest = ({ file, onError, onSuccess, onProgress, data }) => {
    return uploadFiles({
      files:files.map(file=>({file})),
      onSuccess: files => {
        props.onUpload(files)
        onSuccess && onSuccess(files)
      }
    })
  }
  // if (props.listType)
  // {
  //   UPLOAD.listType = props.listType;
  // }
  UPLOAD.beforeUpload = (info) => {
    setFiles([info])
  }
  return (
    <CustomUpload {...props.extra}  {...UPLOAD}>
      {props.children}
   </CustomUpload>
    
  )
}

export default FileUpload
