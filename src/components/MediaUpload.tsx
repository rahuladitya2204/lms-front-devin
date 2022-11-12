import React, { ReactNode, useEffect, useState } from 'react'
import { Upload, UploadProps } from 'antd'

import { UploadFileType, ValueUnitType } from '@Types/Common.types'
import { useUploadFiles } from '@Network/Common/CommonQueries'
import styled from '@emotion/styled'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { getMetadata, getThumbnails } from 'video-metadata-thumbnails'

const UPLOAD: UploadProps = {
  onDrop(e) {
    // console.log('Dropped file', e.dataTransfer.file)
  }
}

interface MediaUploadPropsI {
  onUpload: (file: UploadFileType) => void;
  children?: ReactNode;
  listType?: string;
  url?: string;
  height?: string;
  width?: string;
  extra?: UploadProps;
  renderItem: () => ReactNode;
}

const CustomUpload = styled(Upload)`
  .ant-upload-select {
    width: 200px;
    min-height: 200px;
    margin: 0;
  }
`

const MediaUpload: React.FC<MediaUploadPropsI> = props => {
  const { mutate: uploadFiles } = useUploadFiles()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)

  UPLOAD.customRequest = ({ onError, onSuccess, onProgress, data }) => {
    if (!file) return
    setLoading(true)
    return uploadFiles({
      files: [file],
      onSuccess: ([uploadFile]) => {
        uploadFile.file = file
        setLoading(false)
        props.onUpload(uploadFile)
        onSuccess && onSuccess(file)
      }
    })
  }

  UPLOAD.beforeUpload = info => {
    // @ts-ignore
    setFile(info)
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <CustomUpload
      {...UPLOAD}
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
    >
      {props.renderItem ? props.renderItem() : uploadButton}
    </CustomUpload>
  )
}

export default MediaUpload
