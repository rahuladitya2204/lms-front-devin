import React, {  ReactNode, useState } from 'react'
import { Upload, UploadProps } from 'antd'

import { UploadFileType } from '@Types/Common.types'
import { useUploadFiles } from '@Network/Common/CommonQueries'
import styled from '@emotion/styled'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'


const UPLOAD: UploadProps = {
  onDrop(e) {
    // console.log('Dropped files', e.dataTransfer.files)
  }
}

interface MediaUploadPropsI {
  onUpload: (files: UploadFileType[]) => void;
  children?: ReactNode;
  listType?: string;
  url?: string;
  height?: string;
  width?: string;
  extra?: UploadProps;
  renderItem: () => ReactNode;
}

const CustomUpload = styled(Upload)`
.ant-upload-select{
  width: 100%;
  min-height: 200px;
  margin: 0;
}

`

const MediaUpload: React.FC<MediaUploadPropsI> = props => {
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
    <CustomUpload
      {...UPLOAD}
    name="avatar"
    listType="picture-card"
    className="avatar-uploader"
    showUploadList={false}
    
    >
        {props.url?props.renderItem():uploadButton}
  </CustomUpload>
    
  )
}

export default MediaUpload;
