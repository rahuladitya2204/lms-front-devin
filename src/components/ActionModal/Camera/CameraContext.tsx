import { Button, Modal } from 'antd';
import { CameraOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { highlightQuadrilateral } from './highlight-quadrilateral';
import { imageUrlToBlob } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils';

// Define the context and its type
interface CameraContextType {
  openCamera: () => Promise<File | null>;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

// Camera Provider component
export const CameraProvider = ({ children }: { children: React.ReactNode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [resolveCapture, setResolveCapture] = useState<(file: File | null) => void>(() => {});

  // Function to start the camera stream
  const startCamera = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  // Function to capture the image from the video stream and convert to a file
  const handleCapture = useCallback(async () => {
    // const testBlob=await imageUrlToBlob(`https://upload-junk.s3.us-west-2.amazonaws.com/6368e34a86402abb8d2737a9/noprefix/1705772455227.png`)
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        canvasRef.current.toBlob(blob => {
          if (blob) {
            const imageFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
            // const imageFile = testBlob;
            setPreviewImage(URL.createObjectURL(imageFile));
            // resolveCapture(imageFile);
          }
        }, 'image/jpeg');
      }
    }
  }, [resolveCapture]);

  // Function to open the camera and start the stream
  const openCamera = useCallback(() => {
    setIsModalVisible(true);
    startCamera();
    return new Promise<File>((resolve) => {
      setResolveCapture(() => resolve);
    });
  }, [startCamera]);

  const handleAccept = useCallback(() => {
    // When user accepts the captured image, convert it to a File and resolve
    if (previewImage) {
      fetch(previewImage)
        .then((res) => res.blob())
        .then((blob) => {
          const imageFile = new File([blob], "capture.jpg", { type: "image/jpeg" });
          resolveCapture(imageFile);
          setPreviewImage(null);
          setIsModalVisible(false);
        });
    }
  }, [previewImage, resolveCapture]);

  const handleCancel = useCallback(() => {
    // When user cancels, revoke the image URL and resolve with null
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      // resolveCapture(null);
      setPreviewImage(null);
      // setIsModalVisible(false);
    }
    startCamera();
  }, [previewImage, resolveCapture]);

  useEffect(() => {
    // Cleanup function to stop the camera stream when the component is unmounted
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  const overlayRef = useRef<HTMLCanvasElement>(null); // Canvas for overlay

  const processVideoFrame = useCallback(() => {
    // @ts-ignore
    const cv = window.cv;
    if (videoRef.current && canvasRef.current && overlayRef.current && cv) {
      const video = videoRef.current;
      const overlay = overlayRef.current;
      overlay.width = video.videoWidth;
      overlay.height = video.videoHeight;

      // Draw and process frame
      const context = overlay.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, overlay.width, overlay.height);
        // Convert canvas to data URL and process
        const dataUrl = overlay.toDataURL();
        highlightQuadrilateral(dataUrl).then(processedDataUrl => {
          // Create an image from the processed data URL and draw it on the overlay
          const image = new Image();
          image.onload = () => {
            context.clearRect(0, 0, overlay.width, overlay.height);
            context.drawImage(image, 0, 0, overlay.width, overlay.height);
          };
              // @ts-ignore
          image.src = processedDataUrl;
        });
      }
    }

    // Continue processing next frame
    requestAnimationFrame(processVideoFrame);
  }, []);

  useEffect(() => {
    if (isModalVisible) {
      requestAnimationFrame(processVideoFrame);
    }
  }, [isModalVisible, processVideoFrame]);


  return (
    <CameraContext.Provider value={{ openCamera }}>
    {children}
    <Modal
      closable={false}
      visible={isModalVisible}
      footer={null}
      bodyStyle={{
        textAlign: 'center',
        padding: 0,
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        margin: 0,
        backgroundColor: 'black' // Optional: for better contrast
      }}
      style={{ position: 'fixed', top: 0,width:'100%',height:'100%' }}
      width="100%"
      // height="100%"
      zIndex={1000} // Optional: to ensure it's on top
    >
      <Button
        size='large'
        danger
        shape='circle'
        icon={<CloseOutlined />}
        onClick={() => setIsModalVisible(false)}
        style={{ position: 'absolute', top: 10, right: 10, zIndex: 1001 }}
      />
      {!previewImage && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                <canvas ref={overlayRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
          <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} autoPlay />
          <Button
            size='large'
            icon={<CameraOutlined />}
            type="primary"
            shape='circle'
            onClick={handleCapture}
            style={{ position: 'absolute',width:40, bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1001 }}
          />
        </div>
      )}
        {previewImage && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <img src={previewImage} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <Button
              size='large'
              shape='circle'
              danger
              icon={<CloseOutlined />}
              onClick={handleCancel}
              style={{ position: 'absolute', bottom: 20, left: '30%' }}
            />
            <Button
              size='large'
              shape='circle'
              type='primary'
              icon={<CheckOutlined />}
              onClick={handleAccept}
              style={{ position: 'absolute', bottom: 20, right: '30%' }}
            />
          </div>
        )}
      {/* Hidden canvas to capture the image */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Modal>
  </CameraContext.Provider>
  );
};

// useCamera hook to access camera functionality
export const useCamera = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};

// Export the CameraContext for usage in other components if needed
export { CameraContext };
