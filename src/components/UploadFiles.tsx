// @ts-nocheck
import {
  ClockCircleOutlined,
  InboxOutlined,
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Common, Types } from '@adewaskar/lms-common'
import { Form, Input, Space, Spin, Tabs, Upload, UploadProps } from 'antd'
// @ts-nocheck
import React, { ReactNode, useState } from 'react'

import Dragger from 'antd/es/upload/Dragger'
import styled from '@emotion/styled'

const UPLOAD: UploadProps = {
  multiple: true,
  onDrop(e) {
    // console.log('Dropped file', e.dataTransfer.file)
  }
}

interface UpoadFilesPropsI {
  onUpload: (file: Types.UploadFileType) => void;
  children?: ReactNode;
  listType?: string;
  url?: string;
  rounded?: boolean;
  height?: string;
  width?: string;
  extra?: UploadProps;
  renderItem?: () => ReactNode;
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

const UpoadFiles: React.FC<UpoadFilesPropsI> = props => {
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles()
  const [file, setFile] = useState(null)

  UPLOAD.customRequest = ({ onError, onSuccess, onProgress, data }) => {
    if (!file) return
    console.log(file, 'tkukur')
    return uploadFiles({
      files: [file],
      isProtected:false,
      onUploadProgress: e => {
        console.log(e, 'e')
      },
      onSuccess: ([uploadFile]) => {
        uploadFile.file = file
        console.log(file, 'file123123')
        props.onUpload(uploadFile)
        onSuccess && onSuccess(file)
      }
    })
  }

  UPLOAD.beforeUpload = info => {
    // @ts-ignore
    setFile(info)
  }

  return (
    <Tabs
    defaultActiveKey="1"
    items={[
      {
        label: `Upload File`,
        key: '1',
        children: <>
          <Space>
      <Spin spinning={loading} tip="Uploading..">
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
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </Dragger>
      </Spin>
    </Space></>,
      },
      // {
      //   label: `Public URL`,
      //   key: '2',
      //   children: <Form onFinish={() => { }} form={form} layout="vertical" autoComplete="off">
      //   <Form.Item name="url" label="Public URL:*">
      //     <Input />
      //     </Form.Item>
      //   </Form>,
      // }
    ]}
  />
  
  )
}

export default UpoadFiles
