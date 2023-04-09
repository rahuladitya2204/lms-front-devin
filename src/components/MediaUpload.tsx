// @ts-nocheck
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons'
import { Common, Types } from '@adewaskar/lms-common'
// @ts-nocheck
import React, { ReactNode, useState } from 'react'
import { Spin, Upload, UploadProps } from 'antd'

import Dragger from 'antd/es/upload/Dragger'
import ImgCrop from 'antd-img-crop'
import { getMetadata } from 'video-metadata-thumbnails'
import styled from '@emotion/styled'

const UPLOAD: UploadProps = {
  onDrop(e) {
    // console.log('Dropped file', e.dataTransfer.file)
  }
}

interface MediaUploadPropsI {
  onUpload: (d: Types.FileType) => void;
  children?: ReactNode;
  isProtected?: boolean;
  listType?: string;
  prefixKey?: string;
  uploadType?: string;
  cropper?: boolean;
  fileName?: string;
  rounded?: boolean;
  height?: string;
  width?: string;
  extra?: UploadProps;
  renderItem: () => ReactNode;
}
const CustomUpload = styled(Upload)(
  props =>
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
}import { ImgCrop } from 'antd-img-crop';

`
)

const MediaUpload: React.FC<MediaUploadPropsI> = props => {
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles()
  const [file, setFile] = useState(null)
  const [fileList, setFileList] = useState(null)

  const UploadFile = file => {
    if (!file) return
    return uploadFiles({
      files: [{ file: file, prefixKey: props.prefixKey, name: props.fileName }],
      isProtected: props.isProtected,
      onUploadProgress: e => {
        // console.log(e, 'e')
      },
      onSuccess: ([uploadFile]) => {
        console.log(uploadFile, 'hhahah')
        uploadFile.file = file
        props.onUpload(uploadFile)
      }
    })
  }

  UPLOAD.onChange = ({ file, fileList }) => {
    console.log(file, 'file')
    setFile(file)
    setFileList(fileList)
  }

  let UploadComponent = (
    <CustomUpload
      {...UPLOAD}
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
  )

  if (props.uploadType === 'image') {
    const ImageUploadComponent = (
      <CustomUpload
        {...UPLOAD}
        fileList={fileList}
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        iconRender={() => <ClockCircleOutlined />}
        width={props.width || 'auto'}
      >
        {props.renderItem ? props.renderItem() : uploadButton}
      </CustomUpload>
    )
    UploadComponent = props.cropper ? (
      <ImgCrop
        rotationSlider
        onModalOk={e => {
          UploadFile(e)
        }}
      >
        {ImageUploadComponent}
      </ImgCrop>
    ) : (
      ImageUploadComponent
    )
  }

  if (props.type === 'file') {
    UploadComponent = (
      <Dragger
        {...UPLOAD}
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        multiple
        iconRender={() => <ClockCircleOutlined />}
        // @ts-ignore
        width={props.width || 'auto'}
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

export default MediaUpload
