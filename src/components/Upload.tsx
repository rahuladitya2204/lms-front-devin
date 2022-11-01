import React, { useState } from 'react'

import { InboxOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
import { UploadFileType } from '../types/Common.types'
import type { UploadProps } from 'antd'
import { useUploadFiles } from '../queries/Common/CommonQueries'

const { Dragger } = Upload

const props: UploadProps = {
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files)
  }
}

interface UploadComponentPropsI {
  onUpload: (files: UploadFileType[]) => void;
}

const UploadComponent: React.FC<UploadComponentPropsI> = componentProps => {
  const { mutate: uploadFiles } = useUploadFiles()
  const [files, setFiles] = useState<File[]>([])
  props.customRequest = ({ file, onError, onSuccess, onProgress, data }) => {
    return uploadFiles({
      files,
      onSuccess: files => {
        componentProps.onUpload(files)
        onSuccess && onSuccess(files)
      }
    })
  }
  props.beforeUpload = (info) => {
    setFiles([info])
  }
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p>
    </Dragger>
  )
}

export default UploadComponent
