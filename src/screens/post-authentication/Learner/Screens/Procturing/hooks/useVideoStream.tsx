// @ts-nocheck
import { useRef, useEffect, useState } from 'react';
import { notification } from 'antd';

export const useVideoStream = () => {
  const videoRef = useRef(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  useEffect(() => {
    const startVideo = async () => {
      if (!videoRef.current) {
        console.error('Video element is not ready yet');
        return;
      }
  
      console.log('Attempting to start video stream...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log('Got user media stream:', stream);
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsVideoReady(true);
        console.log('Video stream started');
      } catch (err) {
        console.error('Error starting video stream:', err);
        notification.error({
          message: 'Video Error',
          description: 'There was an error accessing the video stream.'
        });
      }
    };
  
    startVideo();
  }, []);
  
  return { videoRef, isVideoReady };
};
