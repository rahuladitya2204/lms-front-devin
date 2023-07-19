//@ts-nocheck

import { ClockCircleOutlined, InboxOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Common, Types } from '@adewaskar/lms-common'
import { Form, Spin, Upload, UploadProps } from 'antd'
import React, { useState } from 'react'

import Dragger from 'antd/es/upload/Dragger'
import ImgCrop from 'antd-img-crop'
import styled from '@emotion/styled'

interface MediaUploadProps {
  onUpload?: (d: Types.FileType, file: File) => void;
  children?: React.ReactNode;
  isProtected?: boolean;
  closeModal?: () => void;
  aspect?: number;
  listType?: string;
  prefixKey?: string;
  source?: Types.FileSource;
  uploadType?: string;
  name?: string | string[];
  cropper?: boolean;
  fileName?: string;
  rounded?: boolean;
  height?: string;
  width?: string;
  extra?: UploadProps;
  renderItem?: () => React.ReactNode;
}

const CustomUpload = styled(Upload)(
  ({ rounded, width = 'auto' }) => `
.ant-upload {
  margin: 0;
  display: block;
  border-radius: ${rounded ? '50% !important' : ''};
  object-fit: cover;
  overflow: hidden;
  width: ${width}px !important;
}
`
)

const UPLOAD: UploadProps = {
  onDrop(e) {
    // console.log('Dropped file', e.dataTransfer.file)
  }
}

const MediaUpload: React.FC<MediaUploadProps> = (props) => {
  const { mutate: uploadFiles, isLoading: loading } = Common.Queries.useUploadFiles()
  const [file, setFile] = useState(null)
  const form = Form.useFormInstance()
  const UploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  UPLOAD.customRequest = () => {
    if (!file) return
    uploadFiles({
      files: [
        {
          file: file,
          prefixKey: props.prefixKey,
          name: props.fileName,
          source: props.source
        }
      ],
      isProtected: props.isProtected,
      onUploadProgress: e => {
        // console.log(e, 'e')
      },
      onSuccess: ([uploadFile]) => {
        uploadFile.file = file
        if (form) {
          form.setFieldValue(props.name, uploadFile._id)
        }
        props.onUpload && props.onUpload(uploadFile, file)
        props.closeModal && props.closeModal()
      }
    })
  }

  UPLOAD.onChange = ({ file }) => {
    setFile(file)
  }

  let uploadProps = {
    ...UPLOAD,
    beforeUpload: (info) => { setFile(info) },
    name: "avatar",
    listType: "picture-card",
    className: "avatar-uploader",
    showUploadList: false,
    iconRender: () => <ClockCircleOutlined />,
    width: props.width || 'auto',
    children: props.renderItem ? props.renderItem() : UploadButton
  }

  if (props.uploadType === 'pdf') {
    uploadProps = { ...uploadProps, type: "application/pdf", accept: "application/pdf" }
  }

  if (props.uploadType === 'image') {
    uploadProps = { ...uploadProps, accept: "image/png,image/jpeg" }
  }

  let UploadComponent = props.cropper && props.uploadType === 'image' ? (
    <ImgCrop
      aspect={props.aspect}
      onModalOk={e => { UploadFile(e) }}
    >
      <CustomUpload {...uploadProps} />
    </ImgCrop>
  ) : (
    <CustomUpload {...uploadProps} />
  )

  if (props.uploadType === 'file') {
    UploadComponent = (
      <Dragger
        {...uploadProps}
        multiple
      >
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

  return (
    <Spin spinning={loading} tip="Uploading..">
      {UploadComponent}
    </Spin>
  )
}

export default MediaUpload;