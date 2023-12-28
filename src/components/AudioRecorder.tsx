import { AudioOutlined, StopOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';

import { Button } from 'antd';

interface VoiceRecorderProps {
  onRecordingDone: (file: File) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingDone }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
        onRecordingDone(file);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone', error);
    }
  }, [onRecordingDone]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      setMediaRecorder(null);
    }
  }, [mediaRecorder]);

  return (
    <div>
      {recording ? (
        <Button icon={<StopOutlined />} onClick={stopRecording} shape="circle" />
      ) : (
        <Button icon={<AudioOutlined />} onClick={startRecording} shape="circle" />
      )}
    </div>
  );
};

export default VoiceRecorder;
