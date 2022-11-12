// @ts-nocheck
import React, { ReactNode, useEffect, useState } from 'react'
import { message, Upload, UploadProps } from 'antd'

import { UploadFileType, ValueUnitType } from '@Types/Common.types'
import { useUploadFiles } from '@Network/Common/CommonQueries'
import styled from '@emotion/styled'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload'

const UPLOAD: UploadProps = {
  onDrop(e) {
    // console.log('Dropped file', e.dataTransfer.file)
  }
}

interface MediaUploadPropsI {
  onUpload: (file: UploadFileType) => void;
  children?: ReactNode;
  listType?: string;
  url?: string;
  height?: string;
  width?: string;
  extra?: UploadProps;
  renderItem: () => ReactNode;
}


const MediaUpload: React.FC<MediaUploadPropsI> = props => {
  const { mutate: uploadFiles } = useUploadFiles()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  const UPLOAD: UploadProps = {
    onDrop(e) {
      // console.log('Dropped file', e.dataTransfer.file)
    }
  }

  UPLOAD.customRequest = ({ onError, onSuccess, onProgress, data }) => {
    if (!file) return
    setLoading(true)
    return uploadFiles({
      files: [file],
      onSuccess: ([uploadFile]) => {
        uploadFile.file = file
        setLoading(false)
        props.onUpload(uploadFile)
        onSuccess && onSuccess(file)
      }
    })
  }

  const beforeUpload = (file: any) => {
    // @ts-ignore
    // setFile(file);
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  UPLOAD.onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };


  const handleChange: UploadProps['onChange'] = ({ file }: UploadChangeParam<UploadFile>) => {
    setFile(file);
    if (file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (file.status === 'done') {
      // Get this url from response in real world.
      getBase64(file.originFileObj as RcFile, url => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  // const customRequest = ({ onError, onSuccess, onProgress, data }) => {
  //   if (!file) return
  //   setLoading(true)
  //   return uploadFiles({
  //     files: [file],
  //     onSuccess: ([uploadFile]) => {
  //       uploadFile.file = file
  //       setLoading(false)
  //       props.onUpload(uploadFile)
  //       onSuccess && onSuccess(file)
  //     }
  //   })
  // }

  UPLOAD.beforeCrop = info => {
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
    <ImgCrop onModalOk={(e)=>setFile(e)}>
    <Upload
      {...UPLOAD}
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
      ) : (
        uploadButton
      )}
      </Upload>
      </ImgCrop>
  )
}

export default MediaUpload
