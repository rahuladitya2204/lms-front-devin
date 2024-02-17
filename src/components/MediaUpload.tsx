import {
  ClockCircleOutlined,
  InboxOutlined,
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Col, Form, Row, Spin, Upload, UploadProps } from 'antd'
import { Common, Types } from '@adewaskar/lms-common'
import React, { Fragment, ReactNode, useEffect, useRef, useState } from 'react'

import Compressor from 'compressorjs'
import Dragger from 'antd/es/upload/Dragger'
import ImgCrop from 'antd-img-crop';
import { RcFile } from 'antd/es/upload'
import { compressImage } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import { debounce } from 'lodash'
import styled from '@emotion/styled'

interface CompressOptions extends Compressor.Options {
  grayscale?: boolean;
}
interface MediaUploadPropsI {
  onUpload?: (d: any, file: File) => void;
  children?: ReactNode;
  onChange?: Function;
  isProtected?: boolean;
  closeModal?: () => void;
  perspective?: boolean;
  aspect?: number;
  listType?: string;
  prefixKey?: string;
  source?: Types.FileSource;
  disabled?: boolean;
  uploadType?: string;
  name?: string | string[];
  compress?: Partial<CompressOptions>;
  cropper?: {width?:number,height?:number,aspect?:number};
  fileName?: string;
  multiple?: boolean;
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
.ant-upload-select{
  background-color: transparent !important;
}
.ant-upload {
  margin: 0;
  display: block;
  border-radius: ${(props: { rounded?: boolean, width?: string }) =>
    props.rounded ? '50% !important' : ''};
  object-fit: cover;
  overflow: hidden;
  width: ${props.width} !important;
}

.ant-upload:hover {
  // border: 1px dashed grey;
}
`
)

const MediaUpload: React.FC<MediaUploadPropsI> = props => {
  // @ts-ignore
  const aspectRatio = props.cropper ? (props.aspect || (props.cropper.width / props.cropper.height)) : undefined;
  const {
    mutate: uploadFiles,
    isLoading: loading
  } = Common.Queries.useUploadFiles()
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const isProcessing = useRef(null);
  // const value = Form.useWatch([props.name], form);
  const UploadFile = (files: File[]) => {
    // @ts-ignore
    isProcessing.current = true;
    if (!(files&&files.length)) return
    return uploadFiles({
            // @ts-ignore
  files: files.map(file=>(
        {
          file: file,
          prefixKey: props.prefixKey,
          name: props.fileName,
          source: props.source
        }
  )),
      options: props.compress,
      compressFn: props.compress? compressImage:undefined,
      isProtected: props.isProtected,
      onUploadProgress: e => {
        // console.log(e, 'e')
      },
      onSuccess: (uploadFiles) => {
        // @ts-ignore
        isProcessing.current = false;
        uploadFiles.forEach((F, index) => {
              // @ts-ignore
        uploadFiles[index].file=fileList[index].file
        })
        console.log(uploadFiles,'hauy')
        // @ts-ignore
        props.onUpload && props.onUpload(props.multiple ? uploadFiles : uploadFiles[0]);
        setFileList([])
        props.closeModal && props.closeModal()
      }
    })
  }

  useEffect(() => {
    if (!isProcessing.current) {
      // console.log(fileList,'file')
       // Process files for upload here
      if (fileList.length > 0) {
        if (!props.disabled) {
      // Assuming `UploadFile` function processes the files
      // @ts-ignore
      UploadFile(fileList.map(f => f.originFileObj));
      }
    }
    }
   
  }, [fileList]); // Dependency array ensures this runs only when fileList changes

  // UPLOAD.customRequest = () => {
  //   debugger;
  //           // @ts-ignore
  // UploadFile(fileList.map(f=>f.originFileObj))
  // }
             // @ts-ignore
             const onChange = ({ file, fileList }) => {
    // debugger;
            // @ts-ignore
               setFileList(fileList);
               // @ts-ignore
               props.onChange && props.onChange(fileList)
               console.log('Again')
  }

  const UploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  let UploadComponent = (
    <Dragger
      onChange={debounce(onChange,500)}
      multiple={props.multiple}
      beforeUpload={(info,fileList) => {
        setFileList(fileList)
      }}
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      iconRender={() => <ClockCircleOutlined />}
      // @ts-ignore
      width={props.width || 'auto'}
    >
      {/* @ts-ignore */}

      {props.renderItem ? props.renderItem(fileList) : <DraggerBody />}
    </Dragger>
  )

  if (props.uploadType === 'pdf') {
    UploadComponent = (
      <CustomUpload
        onChange={debounce(onChange,500)}
        multiple={props.multiple}
        beforeUpload={(info,fileList) => {
          setFileList(fileList)
        }}
        name="avatar"
        fileList={fileList}

        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        iconRender={() => <ClockCircleOutlined />}
        accept="application/pdf"
        // @ts-ignore
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
        onChange={debounce(onChange,500)}
        multiple={props.multiple}
        fileList={fileList}
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        iconRender={() => <ClockCircleOutlined />}
                // @ts-ignore
        width={props.width || 'auto'}
      >
        {props.renderItem ? props.renderItem() : UploadButton}
      </CustomUpload>
    )
    UploadComponent = props.cropper ? (
      <ImgCrop aspect={aspectRatio} quality={1}>
        {ImageUploadComponent}
        </ImgCrop>
    ) : (
      ImageUploadComponent
    )
  }

  if (props.uploadType === 'file') {
    UploadComponent = (
      <Dragger
        onChange={debounce(onChange,500)}
        style={{ paddingLeft: 10, paddingRight: 10 }}
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        multiple={false}
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
