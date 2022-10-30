import React, { useState } from 'react'
import { Upload, message } from 'antd'

import { GetFileUrls } from '../queries/Common/api'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { useUploadFiles } from '../queries/Common/CommonHooks'

const { Dragger } = Upload

const props: UploadProps = {
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files)
  }
}

const UploadComponent: React.FC = () => {
  const { mutate: uploadFiles } = useUploadFiles()
  const [files, setFiles] = useState([])
  props.customRequest = ({ file, onError, onSuccess, onProgress, data }) => {
    console.log(files, 'eeee')
    // @ts-ignore
    return uploadFiles(files)
  }
  props.beforeUpload = info => {
    // @ts-ignore
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
