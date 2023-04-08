// @ts-nocheck
import {
  ClockCircleOutlined,
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Common, Types } from '@adewaskar/lms-common'
// @ts-nocheck
import React, { ReactNode, useState } from 'react'
import { Spin, Upload, UploadProps } from 'antd'

import { getMetadata } from 'video-metadata-thumbnails'
import styled from '@emotion/styled'

const UPLOAD: UploadProps = {
  onDrop(e) {
    // console.log('Dropped file', e.dataTransfer.file)
  }
}

interface MediaUploadPropsI {
  onUpload: (file: Types.UploadFileType) => void;
  children?: ReactNode;
  isProtected?: boolean;
  listType?: string;
  keyName?: string;
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
}
`
)

const MediaUpload: React.FC<MediaUploadPropsI> = props => {
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles()
  const [file, setFile] = useState(null)

  UPLOAD.customRequest = ({ onError, onSuccess, onProgress, data }) => {
    if (!file) return
    return uploadFiles({
      files: [{file:file,name:props.keyName}],
      isProtected: !!props.isProtected,
      onUploadProgress: e => {
        console.log(e, 'e')
      },
      onSuccess: async ([uploadFile]) => {
        console.log(uploadFile, 'hhahah');
        if (file.type.includes('video')) {
          const {duration} = await getMetadata(file as File);
          uploadFile.metadata = {
            duration: {
              value: duration,
              unit:'seconds'
            }
            };
        }
        uploadFile.file = file
        console.log(uploadFile, 'file123123')
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
    <Spin spinning={loading} tip="Uploading..">
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
    </Spin>
  )
}

export default MediaUpload
