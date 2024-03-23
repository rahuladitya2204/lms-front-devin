// @ts-nocheck
import { Alert, Badge, Button, Image, Modal } from 'antd';
import { Camera, CameraType } from 'react-camera-pro';
import { CameraOutlined, CheckOutlined, CloseOutlined, WarningOutlined } from '@ant-design/icons';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { blobToFile, compressImage } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils';

import { requestCameraPermission } from '@Components/Editor/SunEditor/utils';

// import { highlightQuadrilateral } from './highlight-quadrilateral';


export const AppCamera = ({  onClickPhoto, closeModal }: {onClickPhoto: Function, closeModal?:Function}) => {
  const cameraRef = useRef<CameraType>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // For single image preview
  const [capturedImages, setCapturedImages] = useState<string[]>([]); // For storing URLs in multiple capture mode
  const [multiple, setMultiple] = useState(false); // Flag to indicate if multiple capture mode is enabled
  const handleCapture = useCallback(async () => {
    const imageUrl = await cameraRef.current?.takePhoto();
    if (imageUrl) {
      // Process for highlighting, if enabled
      let processedImageUrl = imageUrl;
      // if (enableQuadrilateralHighlighting) {
      //   const res = await highlightQuadrilateral(imageUrl);
      //   processedImageUrl = res.url;
      // }
      
      if (multiple) {
        // In multiple capture mode, add to the array
        setCapturedImages(prev => [...prev, processedImageUrl]);
      } else {
        // For single capture, just set the preview image
        setPreviewImage(processedImageUrl);
      }
    }
  }, [multiple]);

  const handleAccept = useCallback(async () => {
    // Handle accept for single image mode
    if (previewImage && !multiple) {
      const response = await fetch(previewImage);
      const blob = await response.blob();
      const file = await compressImage(blobToFile(blob, 'captured-image.jpg', 'image/jpeg'), {
        maxWidth: 1240, maxHeight: 1754, quality: 1
      });
      onClickPhoto(file); // Ensure to resolve with an array for consistency
      handleClose()
      // setIsModalVisible(false);
      setPreviewImage(null); // Reset after processing
    }
  }, [previewImage, multiple]);

  const handleDone = useCallback(async () => {
    // Finalize multiple captures
    if (multiple && capturedImages.length > 0) {
      const files = await Promise.all(capturedImages.map(async (imageUrl) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return blobToFile(blob, 'captured-image.jpg', 'image/jpeg');
      }));
      onClickPhoto(files);
      handleClose()
      // setIsModalVisible(false);
      setCapturedImages([]); // Reset after finalizing
    }
  }, [capturedImages, multiple]);

  const handleCancel = useCallback(() => {
    // Handle cancel for single image mode
    setPreviewImage(null);
    // setIsModalVisible(false);
  }, []);

  const handleClose = useCallback(() => {
    // Handle cancel for single image mode
    setPreviewImage(null);
    // setIsModalVisible(false);
    // setIsModalFullyOpen(false); // Reset the state when modal is closed
    closeModal && closeModal();
  }, []);

  // useEffect(() => { 
  //   requestCameraPermission();
  // },[])

  return (
    <>
     { <div
        >
        <Alert icon={<WarningOutlined/>} style={{zIndex:100000,width:'85%',position:'absolute',top: 10,left:'3%' }} message='Make sure to capture OMR border in the image.' type='error' />
        <Button shape='circle' danger icon={<CloseOutlined />} style={{ position: 'fixed', top: 10, right: 10, zIndex: 100000 }} onClick={handleClose} />
        {!previewImage && <div style={{
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
        // width: '100%',
        // height: '100%',
      }}>
          <Camera facingMode="environment" ref={cameraRef} />
        </div>}
        {previewImage && !multiple && (
          <div >
            <img src={previewImage} alt="Preview"  style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }} />
            <Button shape='circle' icon={<CloseOutlined />} style={{ position: 'absolute', width: 40, height: 40, bottom: 44, left: '30%' }} onClick={handleCancel}></Button>
            <Button shape='circle' icon={<CheckOutlined />} style={{ position: 'absolute', width: 40, height: 40, bottom: 44, right: '30%' }} onClick={handleAccept}></Button>
          </div>
        )}
        {!previewImage && <Button size='large' icon={<CameraOutlined />} style={{ position: 'absolute', left: '50%', bottom: 20, transform: 'translateX(-50%)',zIndex: 100000 }} size="large" type="primary" shape="circle" onClick={handleCapture} />}
        {multiple && capturedImages.length > 0 && (
          <>
            <div style={{ position: 'absolute', left: '24%', bottom: 10, maxHeight: '300px', overflowY: 'auto' }}>
              <Badge style={{position:'absolute',top:15,right: 15}} count={capturedImages.length}>
              <Image.PreviewGroup>
              {capturedImages.map((image, index) => (
                <Image key={index} src={image} alt="Thumbnail" style={{ width: '60px', marginRight: '5px',display: index===capturedImages.length-1?'block':'none' }} />
              ))}
              </Image.PreviewGroup>
             </Badge>
            </div>
            <Button shape='circle' icon={<CheckOutlined />} style={{ position: 'absolute', right: '30%', bottom: 20 }} onClick={handleDone} />
          </>
        )}
      </div>}
    </>
  );
};

export const useCamera = () => {
  const context = {}
  if (!context) {
    throw new Error('useCamera must be used within a AppCamera');
  }
  return context;
};
