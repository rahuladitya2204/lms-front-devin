import {
    ClockCircleOutlined,
    LoadingOutlined,
    PlusOutlined
} from '@ant-design/icons'
import { Common, Types } from '@adewaskar/lms-common'
import React, { ReactNode, useState } from 'react'
import { Upload, UploadProps } from 'antd'

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
  
  const CustomUpload = styled(Upload)`
    .ant-upload-select {
      margin: 0;
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
  
  const VideoUpload: React.FC<VideoUploadPropsI> = props => {
    const { mutate: uploadFiles } = Common.Queries.useUploadFiles()
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
        rounded={props.rounded}
        // height={props.height}
        // width={props.width}
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
  
  export default VideoUpload
  