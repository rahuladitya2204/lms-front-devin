import React, { useState, useEffect, useRef } from 'react'
import { notification } from 'antd'
import * as faceapi from 'face-api.js'

function ProctoringComponent () {
  const [isProctoring, setIsProctoring] = useState(true)
  const [keyStrokes, setKeyStrokes] = useState([])
  const videoRef = useRef(null)

  const handleViolation = (type, message) => {
    console.log(`Violation Detected: ${type}`)
    notification.warning({
      message: type,
      description: message
    })
    // Further actions can be taken here, such as logging the event or alerting an examiner
  }

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
      await faceapi.nets.faceExpressionNet.loadFromUri('/models')
      setIsProctoring(true)
    }

    loadModels()
  }, [])

  useEffect(
    () => {
      if (isProctoring) {
        const video = videoRef.current
        video.play()
        const canvas = faceapi.createCanvasFromMedia(video)
        document.body.append(canvas)
        const displaySize = { width: video.width, height: video.height }
        faceapi.matchDimensions(canvas, displaySize)

        setInterval(async () => {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
          if (detections.length > 0) {
            const resizedDetections = faceapi.resizeResults(
              detections,
              displaySize
            )
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

            const expressions = resizedDetections[0].expressions
            if (expressions.surprised > 0.9 || expressions.happy > 0.9) {
              handleViolation(
                'Facial Expression',
                'Suspicious facial expression detected.'
              )
            }
          }
        }, 100)
      }
    },
    [isProctoring]
  )

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
    <div>
      <video ref={videoRef} width="720" height="560" autoPlay muted />
      <button onClick={() => setIsProctoring(!isProctoring)}>
        {isProctoring ? 'Stop Proctoring' : 'Start Proctoring'}
      </button>
    </div>
  )
}

export default ProctoringComponent
