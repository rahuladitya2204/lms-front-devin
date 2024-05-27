// @ts-nocheck
import { Alert, Badge, Button, Image, Modal, Spin, message } from "antd";
import { Camera, CameraType } from "react-camera-pro";
import {
  CameraOutlined,
  CheckOutlined,
  CloseOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  blobToFile,
  compressImage,
} from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";

import { requestCameraPermission } from "@Components/Editor/SunEditor/utils";
import { uniqueId } from "lodash";
import Fullscreen from "@Components/Fullscreen";
import styled from "styled-components";

const CustomSpin = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(50%, 50%);
  z-index: 999;
`;

const CameraContext = createContext({
  openCamera: () => Promise.resolve([]),
});

export const CameraProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onClickPhoto, setOnClickPhoto] = useState(null);
  const [closeModal, setCloseModal] = useState(null);
  const [permissionError, setPermissionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openCamera = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setIsOpen(true);
      setPermissionError(false);
      setIsLoading(false);
      return new Promise((resolve) => {
        setOnClickPhoto(() => (files) => {
          resolve(files);
        });
      });
    } catch (error) {
      console.error("Permission error:", error);
      setIsLoading(false);
      message.error("Permission Error");
      throw error;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setOnClickPhoto(null);
    setCloseModal(null);
  };

  return (
    <>
      <CustomSpin spinning={isLoading} tip="Opening Camera.." />
      <CameraContext.Provider value={{ openCamera }}>
        {children}
        {isOpen && !permissionError && (
          <AppCamera
            isLoading={isLoading}
            onClickPhoto={onClickPhoto}
            closeModal={() => {
              closeModal && closeModal();
              handleClose();
            }}
          />
        )}
        {permissionError && (
          <div>
            <Alert
              message="Permission Error"
              description="Failed to access camera or enter fullscreen mode. Please check your browser permissions and try again."
              type="error"
              showIcon
            />
            <Button onClick={handleClose}>Close</Button>
          </div>
        )}
      </CameraContext.Provider>
    </>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error("useCamera must be used within a CameraProvider");
  }
  return context;
};

export const AppCamera = ({
  onClickPhoto,
  closeModal,
  isLoading,
  multiple = true,
}: {
  onClickPhoto: (f: File[]) => void;
  closeModal?: Function;
  multiple?: boolean;
  isLoading: boolean;
}) => {
  const cameraRef = useRef<CameraType>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  const handleCapture = useCallback(async () => {
    const imageUrl = await cameraRef.current?.takePhoto();
    if (imageUrl) {
      let processedImageUrl = imageUrl;
      setPreviewImage(processedImageUrl);
    }
  }, []);

  const handleAccept = useCallback(async () => {
    if (previewImage) {
      const response = await fetch(previewImage);
      const blob = await response.blob();
      const file = await compressImage(
        blobToFile(blob, "captured-image.jpg", "image/jpeg"),
        {
          maxWidth: 1240,
          maxHeight: 1754,
          quality: 1,
        }
      );

      if (multiple) {
        setCapturedImages((prev) => [...prev, previewImage]);
        setPreviewImage(null);
      } else {
        onClickPhoto([file]);
        handleClose();
        setPreviewImage(null);
      }
    }
  }, [previewImage, multiple]);

  const handleDone = useCallback(async () => {
    if (multiple && capturedImages.length > 0) {
      const files = await Promise.all(
        capturedImages.map(async (imageUrl) => {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          return blobToFile(
            blob,
            `captured-image-${uniqueId()}.jpg`,
            "image/jpeg"
          );
        })
      );
      onClickPhoto(files);
      handleClose();
      setCapturedImages([]);
    }
  }, [capturedImages, multiple]);

  const handleCancel = useCallback(() => {
    setPreviewImage(null);
  }, []);

  const handleClose = useCallback(() => {
    setPreviewImage(null);
    closeModal && closeModal();
  }, []);

  return (
    <Fullscreen>
      <Alert
        icon={<WarningOutlined />}
        style={{
          zIndex: 100000,
          width: "85%",
          position: "absolute",
          top: 10,
          left: "3%",
          fontSize: 13,
        }}
        message="Make sure to capture page border in the image."
        type="error"
      />
      <Button
        shape="circle"
        danger
        type="primary"
        icon={<CloseOutlined />}
        style={{ position: "fixed", top: 10, right: 5, zIndex: 100000 }}
        onClick={handleClose}
      />
      {/* {!previewImage && (
        <div>
          <Camera facingMode="environment" ref={cameraRef} />
        </div>
      )} */}
      <div>
        <Camera facingMode="environment" ref={cameraRef} />
      </div>
      {previewImage && (
        <div>
          <img
            src={previewImage}
            alt="Preview"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <Button
            shape="circle"
            danger
            type="dashed"
            icon={<CloseOutlined />}
            style={{
              position: "absolute",
              width: 40,
              height: 40,
              bottom: 44,
              left: "30%",
            }}
            onClick={handleCancel}
          ></Button>
          <Button
            shape="circle"
            type="dashed"
            icon={<CheckOutlined />}
            style={{
              position: "absolute",
              width: 40,
              height: 40,
              bottom: 44,
              right: "30%",
            }}
            onClick={handleAccept}
          ></Button>
        </div>
      )}
      {!previewImage && (
        <Button
          size="large"
          icon={<CameraOutlined />}
          style={{
            position: "absolute",
            left: "50%",
            bottom: 20,
            transform: "translateX(-50%)",
            zIndex: 100000,
            width: 50,
            height: 50,
          }}
          size="large"
          shape="circle"
          onClick={handleCapture}
        />
      )}
      {multiple && !previewImage && capturedImages.length > 0 && (
        <>
          <div
            style={{
              position: "absolute",
              left: 5,
              bottom: 0,
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            <Badge
              style={{ position: "absolute", top: 15, right: 15 }}
              count={capturedImages.length}
            >
              {/* <Image.PreviewGroup> */}
              {capturedImages.map((image, index) => (
                <div key={index}>
                  <Image
                    alt="Thumbnail"
                    src={image}
                    style={{
                      width: "30px",
                      marginRight: "5px",
                      display: "block",
                    }}
                  />
                </div>
              ))}
              {/* </Image.PreviewGroup> */}
            </Badge>
          </div>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            style={{ position: "absolute", right: 10, bottom: 30 }}
            onClick={handleDone}
          >
            Done
          </Button>
        </>
      )}
    </Fullscreen>
  );
};
