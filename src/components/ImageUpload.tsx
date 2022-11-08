import React, { Fragment, ReactNode, useState } from 'react'
import { Upload, UploadProps } from 'antd'

import { UploadFileType } from '../types/Common.types'
import { useUploadFiles } from '../network/Common/CommonQueries'
import styled from '@emotion/styled'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'


const UPLOAD: UploadProps = {
  onDrop(e) {
    // console.log('Dropped files', e.dataTransfer.files)
  }
}

interface ImageUploadPropsI {
  onUpload: (files: UploadFileType[]) => void;
  children?: ReactNode;
  listType?: string;
  url?: string;
  extra?: UploadProps;
}

const ImageUpload: React.FC<ImageUploadPropsI> = props => {
  const { mutate: uploadFiles } = useUploadFiles();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  UPLOAD.customRequest = ({ file, onError, onSuccess, onProgress, data }) => {
    setLoading(true);
    return uploadFiles({
      files,
      onSuccess: files => {
        setLoading(false);
        props.onUpload(files)
        onSuccess && onSuccess(files)
      }
    })
  }

  UPLOAD.beforeUpload = (info) => {
    setFiles([info])
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Upload
      {...UPLOAD}
    name="avatar"
    listType="picture-card"
    className="avatar-uploader"
    showUploadList={false}
  >
    {props.url ? <img src={props.url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
  </Upload>
    
  )
}

export default ImageUpload
