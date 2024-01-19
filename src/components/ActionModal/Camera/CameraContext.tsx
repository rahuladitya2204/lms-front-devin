import { Button, Modal } from 'antd';
import { Camera, CameraType } from 'react-camera-pro';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { DetectQuadrilateral } from './useQuadrilateralDetection';
// @ts-ignore
import { useOpenCv } from 'opencv-react'

// Define the context and its type
interface CameraContextType {
  openCamera: () => Promise<Blob>;
}

interface CameraProviderPropsI {
    children:React.ReactNode
    enableQuadrilateralHighlighting?: boolean;
  }

const CameraContext = createContext<CameraContextType | undefined>(undefined);

// Camera Provider component
export const CameraProvider = ({ children, enableQuadrilateralHighlighting }: CameraProviderPropsI) => {
  const cameraRef = useRef<CameraType>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Store captured image
  const [resolveCapture, setResolveCapture] = useState<(blob: Blob | null) => void>(() => {});

  const handleCapture = useCallback(async () => {
    const imageUrl = await cameraRef.current?.takePhoto();
    console.log(imageUrl,'lkl')
    if (imageUrl) {
      // @ts-ignore
      // const imageUrl = URL.createObjectURL(imageBlob);
      setPreviewImage(imageUrl); // Set image for preview
      // No need to close the modal here, as we're going to show the preview
    }
  }, []);

  const openCamera = useCallback(() => {
    setPreviewImage(null); // Reset preview image
    setIsModalVisible(true);
    return new Promise<Blob | null>((resolve) => {
      setResolveCapture(() => resolve);
    });
  }, []);

  const handleAccept = useCallback(() => {
    if (previewImage) {
      fetch(previewImage)
        .then((res) => res.blob())
        .then((blob) => {
          resolveCapture(blob);
          URL.revokeObjectURL(previewImage); // Clean up
          setIsModalVisible(false);
          setPreviewImage(null);
        });
    }
  }, [previewImage, resolveCapture]);

  const handleCancel = useCallback(() => {
    URL.revokeObjectURL(previewImage!); // Clean up
    setPreviewImage(null);
  }, [previewImage]);

  return (
    // @ts-ignore
    <CameraContext.Provider value={{ openCamera }}>
      {children}
      <Modal
        visible={isModalVisible}
        footer={null}
        // onCancel={() => setIsModalVisible(false)}
        bodyStyle={{ textAlign: 'center', padding: 0,position:'fixed',top:0,bottom:0,left:0,right:0 }}
      >
        <Button icon={<CloseOutlined/>} style={{position:'fixed',top:10,right:10,zIndex:1000}} onClick={() => {
          setIsModalVisible(false)
        }} />
        {/* @ts-ignore */}
        {!previewImage && <Camera ref={cameraRef} />}
        {previewImage && (
          <div style={{position:'relative'}}>
            <img src={previewImage} alt="Captured" style={{ width: '100%', height: 'auto' }} />
            <Button danger icon={<CloseOutlined/>} style={{position:'absolute',bottom:44,left:'40%'}} onClick={handleCancel}></Button>
            <Button icon={<CheckOutlined/>} style={{position:'absolute',bottom:44,right:'40%'}} onClick={handleAccept}></Button>
          </div>
        )}
        {!previewImage && <Button style={{
          position: 'absolute',
        bottom: 20,left:'50%'}} type="primary" shape='circle' onClick={handleCapture}></Button>}
      </Modal>
    </CameraContext.Provider>
  );
};

// useCamera hook
export const useCamera = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};
