import {
  ClockCircleOutlined,
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Common, Types } from '@adewaskar/lms-common'
import React, { ReactNode, useState } from 'react'
import { Spin, Upload, UploadProps } from 'antd'

import styled from '@emotion/styled'

// @ts-nocheck

const UPLOAD: UploadProps = {
  onDrop(e) {
    // console.log('Dropped file', e.dataTransfer.file)
  }
}

interface VideoUploadPropsI {
  onUpload: (file: Types.UploadFileType) => void;
  children?: ReactNode;
  listType?: string;
  url?: string;
  rounded?: boolean;
  height?: string;
  width?: string;
  extra?: UploadProps;
  renderItem: () => ReactNode;
}
const CustomUpload = styled(Upload)(
  (props: { width: number }) =>
    `
  .ant-upload-select {
    margin: 0;
    width: ${props.width} !important;
  }
  .ant-upload {
    min-width: 150px !important;
    margin: 0;
    display: block;
    border-radius: ${(props: { rounded?: boolean }) =>
      props.rounded ? '50% !important' : ''};
    object-fit: cover;
    overflow: hidden;
    min-height: 150px !important;
  }
  `
)

const VideoUpload: React.FC<VideoUploadPropsI> = props => {
  const {
    mutate: uploadVideo,
    isLoading: loading
  } = Common.Queries.useUploadVideo()
  const [file, setFile] = useState(null)

  UPLOAD.customRequest = ({ onError, onSuccess, onProgress, data }) => {
    if (!file) return
    return uploadVideo({
      file: file,
      onUploadProgress: (e: any) => {
        console.log(e, 'e')
      },
      onSuccess: () => {
        // uploadFile.file = file
        // console.log(file, 'file123123')
        // props.onUpload(uploadFile)
        // onSuccess && onSuccess(file)
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
    <Spin spinning={loading} tip="Uploading..">
      <CustomUpload
        {...UPLOAD}
        // rounded={props.rounded}
        // height={props.height}
        // width={props.width}
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        iconRender={() => <ClockCircleOutlined />}
        // @ts-ignore
        width={props.width || 'auto'}
      >
        {props.renderItem ? props.renderItem() : uploadButton}
      </CustomUpload>
    </Spin>
    // </ImgCrop>
  )
}

export default VideoUpload
