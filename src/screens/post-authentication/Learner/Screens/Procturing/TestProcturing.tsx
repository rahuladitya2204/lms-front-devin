// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { notification } from 'antd';
import * as faceapi from 'face-api.js';
import '@tensorflow/tfjs';
import Draggable from 'react-draggable';
import './style.css';
const NO_FACE_DETECTED_DELAY = 5000;
interface IDefaultPosition {
  x: number;
  y: number;
}

interface IViolationTimeRef {
  [key: string]: number | null;
}

const ProctoringComponent: React.FC = () => {
  const [isProctoring, setIsProctoring] = useState<boolean>(false);
  const [keyStrokes, setKeyStrokes] = useState<string[]>([]);
  const [defaultPosition, setDefaultPosition] = useState<IDefaultPosition>({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastViolationTimeRef = useRef<IViolationTimeRef>({});
  const violationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const violationCooldown = 0; // 1 minute cooldown
  const [startLookingAwayTime, setStartLookingAwayTime] = useState(null);
  const [isLookingAway, setIsLookingAway] = useState(false);
  
  const noFaceDetectedRef = useRef(0);
  const noFaceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousMouthDistanceRef = useRef<number | null>(null);


  useEffect(() => {
    const setStartPosition = () => {
      const x = window.innerWidth - 200 - 10; // width of video-window + margin
      const y = window.innerHeight - 150 - 10; // height of video-window + margin
      setDefaultPosition({ x, y });
    };

    setStartPosition();
    window.addEventListener('resize', setStartPosition);
    return () => {
      window.removeEventListener('resize', setStartPosition);
    };
  }, []);

  const handleViolation = (type: string, message: string) => {
    // type = 'Violation';
    const currentTime = Date.now();

    if (!lastViolationTimeRef.current[type] || currentTime - (lastViolationTimeRef.current[type] as number) > violationCooldown) {
      console.log(`Violation Detected: ${type}`);
      notification.warning({
        message: type,
        description: message,
      });
      lastViolationTimeRef.current[type] = currentTime;

      // Set a timeout to clear the last violation time after the cooldown period
      if (violationTimeoutRef.current) clearTimeout(violationTimeoutRef.current);
      violationTimeoutRef.current = setTimeout(() => {
        lastViolationTimeRef.current[type] = null;
      }, violationCooldown);
    }
  };

  const [stream, setStream] = useState<MediaStream | null>(null);

  const startVideo = async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }
      setStream(videoStream);
    } catch (err) {
      console.error('Error starting video stream:', err);
      notification.error({
        message: 'Video Error',
        description: 'There was an error accessing the video stream.',
      });
    }
  };
  
  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    } else {
      console.log("Stream not found");
    }
  };
  useEffect(() => {
    startVideo();
    setIsProctoring(true);
    return () => {
      // Cleanup function to stop the video and release the camera resources
      stopVideo();
    };

  }, []);
  

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        setIsProctoring(true);
      } catch (err) {
        console.error('Error loading models:', err);
        notification.error({
          message: 'Model Loading Error',
          description: 'There was an error loading the face detection models.',
        });
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!isProctoring || !videoRef.current) return;
  
    const video = videoRef.current;
  
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        setIsProctoring(true);
      } catch (err) {
        console.error('Error loading models:', err);
        notification.error({
          message: 'Model Loading Error',
          description: 'There was an error loading the face detection models.',
        });
      }
    };
  
    loadModels();



    const handleTalkingViolation = (landmarks) => {
      const calculateMouthDistance = (landmarks) => {
        const mouth = landmarks.getMouth();
        const topLip = mouth[13];
        const bottomLip = mouth[14];
        const distance = Math.sqrt((topLip.x - bottomLip.x) ** 2 + (topLip.y - bottomLip.y) ** 2);
        return distance;
      };
      const currentMouthDistance = calculateMouthDistance(landmarks);
      if (previousMouthDistanceRef.current !== null) {
        const mouthDistanceChange = Math.abs(currentMouthDistance - previousMouthDistanceRef.current);
        if (mouthDistanceChange > 16) { // Define your threshold
          handleViolation('Talking', 'It seems like you might be talking to someone.');
        }
      }
      previousMouthDistanceRef.current = currentMouthDistance;
    };
    
  
    const handleNoFaceDetected = (detections) => {
      if (detections.length === 0) {
        noFaceDetectedRef.current += 1;
        if (noFaceDetectedRef.current > 5 && !noFaceTimeoutRef.current) {
          noFaceTimeoutRef.current = setTimeout(() => {
            handleViolation('No Face Detected', 'No face detected in the video for a prolonged period. Please ensure you are visible in the camera.');
            noFaceDetectedRef.current = 0;
            noFaceTimeoutRef.current = null;
          }, NO_FACE_DETECTED_DELAY);
          // 
        }
      } else {
        noFaceDetectedRef.current = 0;
        if (noFaceTimeoutRef.current) {
          clearTimeout(noFaceTimeoutRef.current);
          noFaceTimeoutRef.current = null;
        }

        if (detections.length === 1) {
          const landmarks = detections[0].landmarks;
          handleTalkingViolation(landmarks);
        }
    
      }
    };
  
    const handleMultipleFacesDetected = (detections) => {
      if (detections.length > 1) {
        handleViolation('Multiple Faces Detected', 'More than one face detected directly looking at the screen.');
      }
    };
  
    const handleLookingAwayViolation = (detections) => {
      if (detections.length === 1) {
        const landmarks = detections[0].landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const angle = Math.atan2(rightEye[3].y - leftEye[0].y, rightEye[3].x - leftEye[0].x);
        const angleThreshold = 0.15;
    
        if (Math.abs(angle) > angleThreshold) {
          if (!isLookingAway) {
            setIsLookingAway(true);
            setStartLookingAwayTime(Date.now());
          } else {
            const currentTime = Date.now();
            if (currentTime - startLookingAwayTime > 5000) { // 5000 milliseconds or 5 seconds
              handleViolation('Looking Away', 'Student seems to be looking away for more than 5 seconds.');
              setIsLookingAway(false); // Reset the state after triggering the violation
              setStartLookingAwayTime(null);
            }
          }
        } else {
          if (isLookingAway) {
            setIsLookingAway(false);
            setStartLookingAwayTime(null);
          }
        }
      }
    }
  
    const handleSuspiciousFacialExpression = (detections) => {
      if (detections.length === 1) {
        const expressions = detections[0].expressions;
        if (expressions.surprised > 0.9 || expressions.happy > 0.9) {
          handleViolation('Facial Expression', 'Suspicious facial expression detected.');
        }
      }
    };
  
    const runViolationsCheck = async () => {
      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();
        handleNoFaceDetected(detections);
        handleMultipleFacesDetected(detections);
        handleLookingAwayViolation(detections);
        // handleSuspiciousFacialExpression(detections);
      } catch (err) {
        console.error('Error during face detection:', err);
      }
    };
  
    const intervalId = setInterval(runViolationsCheck, 100);
  
    return () => {
      clearInterval(intervalId);
      if (noFaceTimeoutRef.current) {
        clearTimeout(noFaceTimeoutRef.current);
      }
      previousMouthDistanceRef.current = null; // Resetting the mouth distance ref
        };
  }, [isProctoring]);
  


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isProctoring) {
        handleViolation('Focus Loss', 'Please stay on the exam tab.');
      }
    };

    const maliciousPatterns = [
      'Ctrl+Shift+I',
      'Ctrl+Shift+J',
      'Ctrl+Shift+C',
      'Cmd+Opt+I', // For Mac
      'Cmd+Opt+J', // For Mac
      'Cmd+Opt+C', // For Mac
      // Add other patterns as needed
    ];

    const handleKeyDown = (event: KeyboardEvent) => {
      const keyCombination = `${event.ctrlKey ? 'Ctrl+' : ''}${
        event.shiftKey ? 'Shift+' : ''
      }${event.altKey ? 'Alt+' : ''}${event.metaKey ? 'Cmd+' : ''}${event.key}`;
      const newKeyStrokes = [...keyStrokes, keyCombination];
      setKeyStrokes(newKeyStrokes);

      const pattern = newKeyStrokes.slice(-3).join('+'); // Checking the last 3 keystrokes
      if (maliciousPatterns.includes(pattern)) {
        handleViolation('Malicious Keystrokes', 'Suspicious keystroke pattern detected.');
      }
    };

    const handleCopyPaste = (event: ClipboardEvent) => {
      event.preventDefault();
      handleViolation('Copy-Paste Detected', 'Copy-pasting is not allowed during the exam.');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keyStrokes, isProctoring]);

  return (
    <div className="proctoring-container">
      <Draggable defaultPosition={defaultPosition}>
        <div className="video-window">
          <video
            ref={videoRef}
            width="200"
            height="150"
            autoPlay
            muted
            // style={{ display: 'none' }}
          ></video>
        </div>
      </Draggable>
    </div>
  );
};

export default ProctoringComponent;
