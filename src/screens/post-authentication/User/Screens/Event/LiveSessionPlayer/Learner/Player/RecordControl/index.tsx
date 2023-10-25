import React, { useState } from 'react'
import {
  ControlBarButton,
  useMeetingManager
} from 'amazon-chime-sdk-component-library-react'
import { VideoCameraOutlined } from '@ant-design/icons'

const RecordControl = () => {
  const [isRecording, setIsRecording] = useState(false)

  const startRecording = async () => {
    // Logic to start the media capture pipeline using Chime SDK
    setIsRecording(true)
  }

  const stopRecording = async () => {
    // Logic to stop the media capture pipeline using Chime SDK
    setIsRecording(false)
  }

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  return (
    <ControlBarButton
      icon={
        <VideoCameraOutlined
          style={{ fontSize: 15, color: isRecording ? 'red' : '' }}
        />
      }
      onClick={handleRecordClick}
      label={isRecording ? 'Stop' : 'Start'}
    />
  )
}

export default RecordControl
