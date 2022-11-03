import { Button, Upload } from 'antd'
import React, { Fragment, ReactNode, useRef, useState } from 'react'

import { UploadFileType } from '../types/Common.types'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { useUploadFiles } from '../queries/Common/CommonQueries'

const props: UploadProps = {
  onDrop(e) {
    // console.log('Dropped files', e.dataTransfer.files)
  }
}

interface FileUploadPropsI {
  onUpload: (files: UploadFileType[]) => void;
  children?: ReactNode;
}

const FileUpload: React.FC<FileUploadPropsI> = componentProps => {
  const { mutate: uploadFiles } = useUploadFiles()
  const [files, setFiles] = useState<File[]>([])
  props.customRequest = ({ file, onError, onSuccess, onProgress, data }) => {
    return uploadFiles({
      files,
      onSuccess: files => {
        componentProps.onUpload(files)
        onSuccess && onSuccess(files)
      }
    })
  }
  props.beforeUpload = (info) => {
    setFiles([info])
  }
  const buttonRef = useRef(null);
  return (
    <Fragment>
      {props.children}
       {/* <Upload {...props}>
      <div onClick={(e) => {
        if (buttonRef && buttonRef.current)
        {          
              // @ts-ignore
            buttonRef.current.click(e)
        }
      }}>

      </div>
    <Button ref={buttonRef} style={{display: 'none'}} icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload> */}
   </Fragment>
    
  )
}

export default FileUpload
