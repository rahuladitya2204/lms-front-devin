// @ts-nocheck
import { useEffect } from 'react';
import * as faceapi from 'face-api.js';

export const useFaceDetection = (videoRef, isProctoring, handleViolation) => {
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      } catch (err) {
        console.error('Error loading models:', err);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (isProctoring && videoRef.current) {
      const intervalId = setInterval(async () => {
        try {
          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

          // Handle face detection logic here

        } catch (err) {
          console.error('Error during face detection:', err);
        }
      }, 100);

      return () => clearInterval(intervalId);
    }
  }, [videoRef, isProctoring, handleViolation]);
};
