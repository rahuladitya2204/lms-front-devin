// @ts-nocheck
import { Alert, Badge, Button, Image, Modal } from "antd";
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

// import { highlightQuadrilateral } from './highlight-quadrilateral';

export const AppCamera = ({
  onClickPhoto,
  closeModal,
  multiple,
}: {
  onClickPhoto: (f: File[]) => void;
  closeModal?: Function;
  multiple?: boolean;
}) => {
  const cameraRef = useRef<CameraType>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // For single image preview
  const [capturedImages, setCapturedImages] = useState<string[]>([]); // For storing URLs in multiple capture mode

  const handleCapture = useCallback(async () => {
    const imageUrl = await cameraRef.current?.takePhoto();
    if (imageUrl) {
      let processedImageUrl = imageUrl;

      // if (multiple) {
      //   setCapturedImages((prev) => [...prev, processedImageUrl]);
      // } else {
      setPreviewImage(processedImageUrl);
      // }
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
    // Finalize multiple captures
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
      {
        <div style={true ? fullscreenStyle : {}}>
          <Alert
            icon={<WarningOutlined />}
            style={{
              zIndex: 100000,
              width: "85%",
              position: "absolute",
              top: 10,
              left: "3%",
            }}
            message="Make sure to capture page border in the image."
            type="error"
          />
          <Button
            shape="circle"
            danger
            icon={<CloseOutlined />}
            style={{ position: "fixed", top: 10, right: 10, zIndex: 100000 }}
            onClick={handleClose}
          />
          {!previewImage && (
            <div
              style={
                {
                  // position: 'absolute',
                  // top: 0,
                  // left: 0,
                  // right: 0,
                  // bottom: 0,
                  // width: '100%',
                  // height: '100%',
                }
              }
            >
              <Camera facingMode="environment" ref={cameraRef} />
            </div>
          )}
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
              }}
              size="large"
              type="primary"
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
                  <Image.PreviewGroup>
                    {capturedImages.map((image, index) => (
                      <div
                        style={
                          {
                            //  position: "absolute", left: 5, bottom: 0
                          }
                        }
                      >
                        <Image
                          alt="Thumbnail"
                          key={index}
                          src={image}
                          style={{
                            width: "30px",
                            marginRight: "5px",
                            display: "block",
                          }}
                        />
                      </div>
                    ))}
                  </Image.PreviewGroup>
                </Badge>
              </div>
              <Button
                shape="circle"
                icon={<CheckOutlined />}
                style={{ position: "absolute", right: "30%", bottom: 20 }}
                onClick={handleDone}
              />
            </>
          )}
        </div>
      }
    </>
  );
};

export const useCamera = () => {
  const context = {};
  if (!context) {
    throw new Error("useCamera must be used within a AppCamera");
  }
  return context;
};

const fullscreenStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 9999,
  backgroundColor: "black",
};
