// @ts-nocheck
import { Alert, Badge, Button, Image, Modal } from 'antd';
import { Camera, CameraType } from 'react-camera-pro';
import { CameraOutlined, CheckOutlined, CloseOutlined, WarningOutlined } from '@ant-design/icons';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { blobToFile, compressImage } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils';

import { requestCameraPermission } from '@Components/Editor/SunEditor/utils';

// import { highlightQuadrilateral } from './highlight-quadrilateral';

const CameraContext = createContext<CameraContextType | undefined>(undefined);

interface CameraContextType {
  openCamera: (multiple?: boolean) => Promise<File[]>;
}

interface CameraProviderPropsI {
  children: React.ReactNode;
  enableQuadrilateralHighlighting?: boolean;
}

export const CameraProvider = ({ children, enableQuadrilateralHighlighting=false }: CameraProviderPropsI) => {
  const cameraRef = useRef<CameraType>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // For single image preview
  const [capturedImages, setCapturedImages] = useState<string[]>([]); // For storing URLs in multiple capture mode
  const [resolveCapture, setResolveCapture] = useState<(files: File[] | null) => void>(() => {});
  const [multiple, setMultiple] = useState(false); // Flag to indicate if multiple capture mode is enabled
  const [isModalFullyOpen, setIsModalFullyOpen] = useState(false);
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
  }, [enableQuadrilateralHighlighting, multiple]);

  const openCamera = useCallback((isMultiple = false) => {
    return new Promise<File[] | null>(async (resolve,reject) => {
      try {
        await requestCameraPermission();
        setMultiple(isMultiple);
        setIsModalVisible(true);
        setTimeout(() => setIsModalFullyOpen(true), 3000);
        setPreviewImage(null); // Ensure preview is reset every time camera is opened
        setCapturedImages([]); // Always reset for a new session
        setResolveCapture(() => resolve);
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        alert('Please provide camera permissions to use this feature.');
        reject();
      }
    });
  }, []);

  const handleAccept = useCallback(async () => {
    // Handle accept for single image mode
    if (previewImage && !multiple) {
      const response = await fetch(previewImage);
      const blob = await response.blob();
      const file = await compressImage(blobToFile(blob, 'captured-image.jpg', 'image/jpeg'), {
        maxWidth: 1240, maxHeight: 1754, quality: 1
      });
      resolveCapture(file); // Ensure to resolve with an array for consistency
      setIsModalVisible(false);
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
      resolveCapture(files);
      setIsModalVisible(false);
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
    setIsModalVisible(false);
    setIsModalFullyOpen(false); // Reset the state when modal is closed
  }, []);

  // useEffect(() => { 
  //   requestCameraPermission();
  // },[])

  return (
    <CameraContext.Provider value={{ openCamera }}>
      {children}
     {isModalVisible? <div className='camera-container'
         style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          padding: 0,
          margin: 0,
           overflow: 'hidden',
          backgroundColor:'#fff'
        }}
        >
        <Alert icon={<WarningOutlined/>} style={{zIndex:999,width:'80%',position:'absolute',top: 10,left:'3%' }} message='Make sure to capture OMR border in the image.' type='error' />
        <Button shape='circle' danger icon={<CloseOutlined />} style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }} onClick={handleClose} />
        {!previewImage  && isModalFullyOpen && <div style={{
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
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
        {!previewImage && <Button size='large' icon={<CameraOutlined />} style={{ position: 'absolute', left: '50%', bottom: 20, transform: 'translateX(-50%)' }} size="large" type="primary" shape="circle" onClick={handleCapture} />}
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
      </div>:null}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};
