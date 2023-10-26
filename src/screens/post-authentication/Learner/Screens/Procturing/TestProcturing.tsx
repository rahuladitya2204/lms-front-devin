// @ts-nocheck

import React, { useState, useEffect, useRef } from 'react'
import { notification } from 'antd'
import * as faceapi from 'face-api.js'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import '@tensorflow/tfjs'
import Draggable from 'react-draggable'
import './style.css'
function ProctoringComponent () {
  const [isProctoring, setIsProctoring] = useState(false)
  const [keyStrokes, setKeyStrokes] = useState([])
  const [defaultPosition, setDefaultPosition] = useState({ x: 0, y: 0 })
  const videoRef = React.useRef(null)

  useEffect(() => {
    const setStartPosition = () => {
      const x = window.innerWidth - 200 - 10; // width of video-window + margin
      const y = window.innerHeight - 150 - 10; // height of video-window + margin
      setDefaultPosition({ x, y });
    };

    setStartPosition();

    // Update the position when the window is resized
    window.addEventListener('resize', setStartPosition);

    return () => {
      window.removeEventListener('resize', setStartPosition);
    };
  }, []);

  // const canvasRef = useRef(null);

  const handleViolation = (type, message) => {
    console.log(`Violation Detected: ${type}`)
    notification.warning({
      message: type,
      description: message
    })
    // Further actions can be taken here, such as logging the event or alerting an examiner
  }

  const startVideo = async () => {
    const video = videoRef.current
    try {
      video.srcObject = await navigator.mediaDevices.getUserMedia({
        video: true
      })
      video.play()
    } catch (err) {
      console.error('Error starting video stream:', err)
      notification.error({
        message: 'Video Error',
        description: 'There was an error accessing the video stream.'
      })
    }
  }

  useEffect(() => {
    startVideo()
    setIsProctoring(true)
  }, [])

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
        await faceapi.nets.faceExpressionNet.loadFromUri('/models')
        setIsProctoring(true)
      } catch (err) {
        console.error('Error loading models:', err)
        notification.error({
          message: 'Model Loading Error',
          description: 'There was an error loading the face detection models.'
        })
      }
    }

    loadModels()
  }, [])

  useEffect(
    () => {
      if (isProctoring) {
        const video = videoRef.current;
        // const canvas = canvasRef.current;
        // const displaySize = { width: video.width, height: video.height };
        // faceapi.matchDimensions(canvas, displaySize);
  
        const intervalId = setInterval(async () => {
          try {
            const detections = await faceapi
              .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceExpressions();
  
            // const resizedDetections = faceapi.resizeResults(detections, displaySize);
            // const context = canvas.getContext('2d');
            // context.clearRect(0, 0, canvas.width, canvas.height);
            // faceapi.draw.drawDetections(canvas, resizedDetections);
            // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  
            if (detections.length > 0) {
              const landmarks = detections[0].landmarks;
              const leftEye = landmarks.getLeftEye();
              const rightEye = landmarks.getRightEye();
  
              const eyeDistance = Math.hypot(rightEye[3].x - leftEye[0].x, rightEye[3].y - leftEye[0].y);
              const nose = landmarks.getNose();
              const noseToEyeDistance = Math.hypot(nose[0].x - leftEye[0].x, nose[0].y - leftEye[0].y);
  
              const angle = Math.atan2(rightEye[3].y - leftEye[0].y, rightEye[3].x - leftEye[0].x);
  
              // Angle threshold to determine if the user is looking straight. Adjust as necessary.
              const angleThreshold = 0.15; 
              if (Math.abs(angle) > angleThreshold) {
                handleViolation('Looking Away', 'Student seems to be looking away.');
              }
  
              const expressions = detections[0].expressions;
              if (expressions.surprised > 0.9 || expressions.happy > 0.9) {
                handleViolation(
                  'Facial Expression',
                  'Suspicious facial expression detected.'
                );
              }
            }
          } catch (err) {
            console.error('Error during face detection:', err);
          }
        }, 100);
  
        return () => clearInterval(intervalId);
      }
    },
    [isProctoring, videoRef, handleViolation]
  );
  

  useEffect(
    () => {
      const handleVisibilityChange = () => {
        if (document.hidden && isProctoring) {
          handleViolation('Focus Loss', 'Please stay on the exam tab.')
        }
      }

      const maliciousPatterns = [
        'Ctrl+Shift+I',
        'Ctrl+Shift+J',
        'Ctrl+Shift+C',
        'Cmd+Opt+I', // For Mac
        'Cmd+Opt+J', // For Mac
        'Cmd+Opt+C' // For Mac
        // Add other patterns as needed
      ]

      const handleKeyDown = event => {
        const keyCombination = `${event.ctrlKey ? 'Ctrl+' : ''}${
          event.shiftKey ? 'Shift+' : ''
        }${event.altKey ? 'Alt+' : ''}${event.metaKey ? 'Cmd+' : ''}${
          event.key
        }`
        const newKeyStrokes = [...keyStrokes, keyCombination]
        setKeyStrokes(newKeyStrokes)

        const pattern = newKeyStrokes.slice(-3).join('+') // Checking the last 3 keystrokes
        if (maliciousPatterns.includes(pattern)) {
          handleViolation(
            'Malicious Keystrokes',
            'Suspicious keystroke pattern detected.'
          )
        }
      }

      const handleCopyPaste = event => {
        event.preventDefault()
        handleViolation(
          'Copy-Paste Detected',
          'Copy-pasting is not allowed during the exam.'
        )
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)
      document.addEventListener('copy', handleCopyPaste)
      document.addEventListener('paste', handleCopyPaste)
      document.addEventListener('cut', handleCopyPaste)
      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        document.removeEventListener('copy', handleCopyPaste)
        document.removeEventListener('paste', handleCopyPaste)
        document.removeEventListener('cut', handleCopyPaste)
        document.removeEventListener('keydown', handleKeyDown)
      }
    },
    [keyStrokes, isProctoring]
  )
  return (
    <div className="proctoring-container">
      <Draggable defaultPosition={defaultPosition}>
        <div className="video-window">
          {/* <div className="handle">Drag me</div> */}
          <video
            ref={videoRef}
            width="200"
            height="150"
            autoPlay
            muted
            style={{ display: 'block' }}
          />
        </div>
      </Draggable>

      {/* <canvas ref={canvasRef} width="720" height="560" /> */}
      {/* <button onClick={() => setIsProctoring(!isProctoring)}>
        {isProctoring ? 'Stop Proctoring' : 'Start Proctoring'}
      </button> */}
    </div>
  )
}

export default ProctoringComponent
