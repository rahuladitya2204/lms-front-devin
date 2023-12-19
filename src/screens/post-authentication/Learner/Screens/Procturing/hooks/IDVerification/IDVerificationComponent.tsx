import './style.css';

import * as faceapi from 'face-api.js';

import { Button, Spin, notification } from 'antd';
import React, { useRef, useState } from 'react';

import { ActionModalI } from '@Components/ActionModal/ActionModal';
import { Title } from '@Components/Typography/Typography';
import Webcam from 'react-webcam';

interface IDVerificationComponentProps extends ActionModalI {
  onMatch: () => void;
}

const IDVerificationComponent: React.FC<IDVerificationComponentProps> = (props) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const preExistingImageUrl = 'https://upload-junk.s3.us-west-2.amazonaws.com/Screenshot+2023-10-27+at+10.29.49+AM.png'; // Replace with the actual URL

  const capture = async () => {
    setLoading(true);
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        await compareFaces(imageSrc);
      }
    }
    setLoading(false);
  };

  const loadModels = async () => {
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
  };

  const compareFaces = async (capturedImageSrc: string) => {
    try {
      await loadModels();

      const capturedImg = await faceapi.fetchImage(capturedImageSrc);
      const existingImg = await faceapi.fetchImage(preExistingImageUrl);

      const capturedFaceDescriptor = await faceapi
        .detectSingleFace(capturedImg)
        .withFaceLandmarks()
        .withFaceDescriptor();

      const existingFaceDescriptor = await faceapi
        .detectSingleFace(existingImg)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (capturedFaceDescriptor && existingFaceDescriptor) {
        const distance = faceapi.euclideanDistance(
          capturedFaceDescriptor.descriptor,
          existingFaceDescriptor.descriptor
        );

        if (distance < 0.6) {
          setResult('Face Matched!');
          // notification.success({
          //   message: 'Success',
          //   description: 'Face Matched!',
          // });
          props.onMatch();
        } else {
          setResult('Face did not match.');
          notification.error({
            message: 'Error',
            description: 'Face did not match.',
          });
        }
      } else {
        setResult('Faces could not be detected.');
        notification.warning({
          message: 'Warning',
          description: 'Faces could not be detected.',
        });
      }
    } catch (error) {
      console.error('Error in face comparison:', error);
      setResult('An error occurred during face comparison.');
      notification.error({
        message: 'Error',
        description: 'An error occurred during face comparison.',
      });
    }
  };

  return (
    <div className="id-verification-container">
      <Title>Please verify yourself</Title>
      <div className="webcam-container">
        <Webcam
          ref={webcamRef}
          // style={{ height: 500 }}
          screenshotFormat="image/jpeg"
          className="webcam"
        />
        <div className="circle"></div>
      </div>
      <Button type="primary" onClick={capture} loading={loading}>
        Capture and Verify
      </Button>
 
      {/* {result && <p className="result-text">{result}</p>} */}
    </div>
  );
};

export default IDVerificationComponent;
