import { Common, Types } from '@adewaskar/lms-common'
import React, { useState } from 'react'

import { InboxOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
import type { UploadProps } from 'antd'

const { Dragger } = Upload

const props: UploadProps = {
  onDrop(e) {

  }
}

interface DraggerUploadPropsI {
  onUpload: (files: Types.UploadFileType[]) => void;
}

const DraggerUpload: React.FC<DraggerUploadPropsI> = componentProps => {
  const { mutate: uploadFiles } = Common.Queries.useUploadFiles()
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

export default DraggerUpload
