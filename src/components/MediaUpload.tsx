//@ts-nocheck

import {
  ClockCircleOutlined,
  InboxOutlined,
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Common, Types } from '@adewaskar/lms-common'
import { Form, Spin, Upload, UploadProps } from 'antd'
import React, { Fragment, ReactNode, useState } from 'react'

import Dragger from 'antd/es/upload/Dragger'
import ImgCrop from 'antd-img-crop'
import styled from '@emotion/styled'

const UPLOAD: UploadProps = {
  onDrop(e) {
    // console.log('Dropped file', e.dataTransfer.file)
  }
}

interface MediaUploadPropsI {
  onUpload?: (d: Types.FileType, file: File) => void;
  children?: ReactNode;
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
  renderItem?: () => ReactNode;
}
const CustomUpload = styled(Upload)(
  (props: { width: number }) =>
    `
.ant-upload-wrapper {
  margin: 0;
}
.ant-upload {
  margin: 0;
  display: block;
  border-radius: ${(props: { rounded?: boolean, width?: string }) =>
    props.rounded ? '50% !important' : ''};
  object-fit: cover;
  overflow: hidden;
  width: ${props.width}px !important;
}

.ant-upload:hover {
  // border: 1px dashed grey;
}
`
)

const MediaUpload: React.FC<MediaUploadPropsI> = props => {
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles()
  const [file, setFile] = useState(null)
  const [fileList, setFileList] = useState(null)
  const form = Form.useFormInstance()
  // const value = Form.useWatch([props.name], form);
  const UploadFile = file => {
    if (!file) return
    return uploadFiles({
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
        console.log(uploadFile, file, '1133')
        props.onUpload && props.onUpload(uploadFile, file)
        props.closeModal && props.closeModal()
      }
    })
  }
  UPLOAD.customRequest = () => {
    UploadFile(file)
  }
  UPLOAD.onChange = ({ file, fileList }) => {
    setFile(file)
    setFileList(fileList)
  }

  const UploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  let UploadComponent = (
    <Dragger
      {...UPLOAD}
      type="video/*"
      beforeUpload={info => {
        setFile(info)
      }}
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      iconRender={() => <ClockCircleOutlined />}
      // @ts-ignore
      width={props.width || 'auto'}
    >
      {props.renderItem ? props.renderItem(file) : <DraggerBody />}
    </Dragger>
  )

  if (props.uploadType === 'pdf') {
    UploadComponent = (
      <CustomUpload
        {...UPLOAD}
        type="video/*"
        beforeUpload={info => {
          setFile(info)
        }}
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        iconRender={() => <ClockCircleOutlined />}
        accept="application/pdf"
        width={props.width || 'auto'}
      >
        {props.renderItem ? props.renderItem() : UploadButton}
      </CustomUpload>
    )
  }

  if (props.uploadType === 'image') {
    const ImageUploadComponent = (
      <CustomUpload
        accept="image/png,image/jpeg"
        {...UPLOAD}
        fileList={fileList}
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        iconRender={() => <ClockCircleOutlined />}
        width={props.width || 'auto'}
      >
        {props.renderItem ? props.renderItem() : UploadButton}
      </CustomUpload>
    )
    UploadComponent = props.cropper ? (
      <ImgCrop
        aspect={props.aspect}
        // rotationSlider
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

  if (props.uploadType === 'file') {
    UploadComponent = (
      <Dragger
        {...UPLOAD}
        beforeUpload={info => {
          setFile(info)
        }}
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

const DraggerBody = () => {
  return (
    <Fragment>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Fragment>
  )
}
