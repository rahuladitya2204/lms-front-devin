// @ts-nocheck
import React, { ReactNode, useState } from 'react'
import { Upload, UploadProps } from 'antd'

import { UploadFileType } from '@Types/Common.types'
import { useUploadFiles } from '@Network/Common/CommonQueries'
import styled from '@emotion/styled'
import {
  ClockCircleOutlined,
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'

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
    width: ${props => (props.width ? props.width : 'auto')};
    height: ${props => (props.height ? props.height : 'auto')};
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
      onUploadProgress: e => {
        console.log(e, 'e')
      },
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
    // <ImgCrop onModalOk={e => setFile(e)}>
    <CustomUpload
      {...UPLOAD}
      height={props.height}
      width={props.width}
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      iconRender={() => <ClockCircleOutlined />}
    >
        {props.renderItem ? props.renderItem() : uploadButton}
    </CustomUpload>
    // </ImgCrop>
  )
}

export default MediaUpload
