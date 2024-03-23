// @ts-nocheck

import { Button, Card, Col, Empty, InputNumber, Row, Slider, Upload, message } from 'antd';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import React, { useState } from 'react';

import Compressor from 'compressorjs';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined } from '@ant-design/icons';

interface ImageDimensions {
  width: number;
  height: number;
}

interface FileSizeRange {
  min: number;
  max: number;
}

const ImageResizer: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
    width: 200,
    height: 200,
  });
  const [fileSizeRange, setFileSizeRange] = useState<FileSizeRange>({ min: 10, max: 50 });

  const onFileChange = (info: { file: UploadFile, fileList: UploadFile[] }) => {
    if (info.file.status === 'done') {
      handleCompress(info.file.originFileObj as RcFile);
    }
    // Update the state of the fileList
    setFileList(info.fileList);
  };

  const handleCompress = (file: RcFile) => {
    new Compressor(file, {
      quality: 0.8,
      maxWidth: imageDimensions.width,
      maxHeight: imageDimensions.height,
      success: (compressedResult: Blob) => {
        if (compressedResult.size / 1024 < fileSizeRange.min || compressedResult.size / 1024 > fileSizeRange.max) {
          message.error(`File size must be between ${fileSizeRange.min}KB and ${fileSizeRange.max}KB.`);
          return;
        }

        const compressedFile = new File([compressedResult], file.name, {
          type: compressedResult.type,
          lastModified: Date.now(),
        });

        const objectUrl = URL.createObjectURL(compressedFile);
        setFileList([{
          uid: '-1', // Can be the actual uid if necessary
          name: file.name,
          status: 'done',
          type: compressedFile.type,
          size: compressedFile.size,
          originFileObj: compressedFile,
          url: objectUrl,
        }]);
      },
      error(err: Error) {
        message.error('Compression failed!');
        console.error(err.message);
      },
    });
  };

  const handleDownload = () => {
    if (fileList.length > 0) {
      const currentFile = fileList[0];
      if (currentFile.originFileObj) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(currentFile.originFileObj);
        link.download = currentFile.name || 'image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    }
  };

  return (
      <Card>
             <Row gutter={16}>
      <Col span={12}>
        <ImgCrop
          grid
          aspect={imageDimensions.width / imageDimensions.height}
          quality={1}
          modalTitle="Edit Image"
          modalWidth={500}
          modalOk="Done"
          modalCancel="Cancel"
          onModalOk={(file: RcFile) => handleCompress(file)}
        >
          <Upload
            accept="image/*"
            listType="picture-card"
            fileList={fileList}
            onChange={onFileChange}
            beforeUpload={() => false}
            onRemove={() => setFileList([])}
          >
                          {fileList.length < 1 && <Empty>
                              <Button icon={<UploadOutlined />}>Upload Photo</Button>
                          </Empty>}
          </Upload>
        </ImgCrop>
      </Col>
      <Col span={12}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
                          <div>Width (px) - {imageDimensions.width} px</div>
            <Slider
              min={100}
              max={500}
              value={imageDimensions.width}
              onChange={(value) => setImageDimensions({ ...imageDimensions, width: value })}
            />
            {/* <InputNumber
              min={100}
              max={500}
              value={imageDimensions.width}
              onChange={(value) => setImageDimensions({ ...imageDimensions, width: value })}
              style={{ width: '100%' }}
            /> */}
          </Col>
          <Col span={24}>
                          <div>Height (px) - {imageDimensions.height}px</div>
            <Slider
              min={100}
              max={500}
              value={imageDimensions.height}
              onChange={(value) => setImageDimensions({ ...imageDimensions, height: value })}
            />
            {/* <InputNumber
              min={100}
              max={500}
              value={imageDimensions.height}
              onChange={(value) => setImageDimensions({ ...imageDimensions, height: value })}
              style={{ width: '100%' }}
            /> */}
          </Col>
          <Col span={24}>
            <div>Min Size (KB)</div>
            <InputNumber
              min={1}
              max={fileSizeRange.max}
              value={fileSizeRange.min}
              onChange={(value) => setFileSizeRange({ ...fileSizeRange, min: value })}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={24}>
            <div>Max Size (KB)</div>
            <InputNumber
              min={fileSizeRange.min}
              max={1024}
              value={fileSizeRange.max}
              onChange={(value) => setFileSizeRange({ ...fileSizeRange, max: value })}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={24}>
                          <Row gutter={[20,20]}>
                              <Col>
                              <Button block type="primary" onClick={handleDownload} disabled={fileList.length === 0}>
              Download
                                  </Button>
                              </Col>
                              <Col>
                              <Button block onClick={() => setFileList([])}>
              Cancel
                                  </Button>
                              </Col>
           </Row>
           
          </Col>
        </Row>
      </Col>
          </Row>
          
 </Card>
  );
};

export default ImageResizer;
