// @ts-nocheck
import {
  ClockCircleOutlined,
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Common, Types } from '@adewaskar/lms-common'
import React, { ReactNode, useState } from 'react'
import { Spin, Upload, UploadProps } from 'antd'

import ImgCrop from 'antd-img-crop'
import styled from '@emotion/styled'

const UPLOAD: UploadProps = {
  onDrop(e) {
    // console.log('Dropped file', e.dataTransfer.file)
  }
}

interface ImageUploadPropsI {
  onUpload: (file: Types.UploadFileType) => void;
  children?: ReactNode;
  listType?: string;
  url?: string;
  keyName?: string;
  rounded?: boolean;
  cropper?: boolean;
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
}

`
)

const ImageUpload: React.FC<ImageUploadPropsI> = props => {
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles()
  const [fileList, setFileList] = useState(null)

  const UploadFile = (file) => {
    if (!file) return
    return uploadFiles({
      files: [{file:file,name:props.keyName}],
      onUploadProgress: e => {
        // console.log(e, 'e')
      },
      onSuccess: ([uploadFile]) => {
        console.log(uploadFile, 'hhahah');
        uploadFile.file = file
        // console.log(file, 'file123123')
        props.onUpload(uploadFile)
        // onSuccess && onSuccess(file)
      }
    })
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const UploadComponent = <CustomUpload
    {...UPLOAD}

    fileList={fileList}
    onChange={onChange}
    name="avatar"
    listType="picture-card"
    className="avatar-uploader"
    showUploadList={false}
    iconRender={() => <ClockCircleOutlined />}

    width={props.width || 'auto'}
  >
    {props.renderItem ? props.renderItem() : uploadButton}
  </CustomUpload>;

  return (
    <Spin spinning={loading} tip="Uploading..">
      {props.cropper?<ImgCrop rotationSlider onModalOk={(e) => {
        // console.log(e, 'donene')
        UploadFile(e);          
      }}>
       {UploadComponent}
      </ImgCrop>:UploadComponent}
    </Spin>
  )
}

export default ImageUpload
