import { Alert, Button, Modal } from 'antd';
import { Camera, CameraType } from 'react-camera-pro';
import { CameraOutlined, CheckOutlined, CloseOutlined, WarningOutlined } from '@ant-design/icons';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { blobToFile, compressImage } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils';

import { highlightQuadrilateral } from './highlight-quadrilateral';
// @ts-ignore
import { useOpenCv } from 'opencv-react';

// Define the context and its type
interface CameraContextType {
  openCamera: () => Promise<File>;
}

interface CameraProviderPropsI {
    children:React.ReactNode
    enableQuadrilateralHighlighting?: boolean;
  }

const CameraContext = createContext<CameraContextType | undefined>(undefined);

// Camera Provider component
export const CameraProvider = ({ children, enableQuadrilateralHighlighting }: CameraProviderPropsI) => {
  const cameraRef = useRef<CameraType>(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [highlightedImage, setHighlightedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // Store captured image
  const [resolveCapture, setResolveCapture] = useState<(blob: Blob | null) => void>(() => {});
  const handleCapture = useCallback(async () => {
    let imageUrl = await cameraRef.current?.takePhoto();
    // const testUrl=await imageUrlToDataUrl(`https://upload-junk.s3.us-west-2.amazonaws.com/6368e34a86402abb8d2737a9/noprefix/1705772455227.png`)
    // @ts-ignore
    const res = (await highlightQuadrilateral(imageUrl));
    // console.log(res,'res')
    // @ts-ignore
    const highlighted = res.url;
    // console.log(imageUrl,'lkl')
    if (imageUrl) {
      setHighlightedImage(highlighted)
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
        .then(blob => compressImage(blobToFile(blob), {
          maxWidth: 1240,maxHeight: 1754,quality:1
        }))
        .then((compressedFile) => {
          resolveCapture(compressedFile);
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
      <Modal closable={false}
        visible={isModalVisible}
        footer={null}
        // onCancel={() => setIsModalVisible(false)}
        bodyStyle={{ textAlign: 'center', padding: 0,position:'fixed',top:0,bottom:0,left:0,right:0 }}
      >
        <Button danger shape='circle' icon={<CloseOutlined/>} style={{position:'fixed',top:10,right:10,zIndex:1000}} onClick={() => {
          setIsModalVisible(false)
        }} />
        {/* @ts-ignore */}
        {!previewImage && <Camera facingMode={facingMode} ref={cameraRef} />}
        {previewImage && (
          <div style={{position:'relative'}}>
            <Alert showIcon icon={<WarningOutlined style={{ fontSize: 20 }} />}
              style={{ position: 'absolute', height: 40, top: 10, right: 10, left: 10, width: '90%' }}
              type='error'
              message='The OMR sheet boundary must be highlighted in red' />
 {highlightedImage?<img src={highlightedImage} alt="Captured" style={{ width: '100%', height: 'auto' }} />:null}
            <Button shape='circle' danger icon={<CloseOutlined/>} style={{position:'absolute',width:40,height:40,bottom:44,left:'30%'}} onClick={handleCancel}></Button>
            <Button shape='circle' type='primary' icon={<CheckOutlined/>} style={{position:'absolute',width:40,height:40,bottom:44,right:'30%'}} onClick={handleAccept}></Button>
          </div>
        )}
        {!previewImage && <Button icon={<CameraOutlined/>} style={{
          position: 'absolute',
          transform: `translateX(-50%)`,
          height: 55,
          width:55,
        bottom: 20,left:'50%'}} size='large' type="primary" shape='circle' onClick={handleCapture}></Button>}
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
