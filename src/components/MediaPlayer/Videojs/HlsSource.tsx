// @ts-nocheck

import React, { Fragment, useEffect, useRef } from 'react';

import { CustomXhrLoader } from '../Playr/Hls';
import Hls from 'hls.js';

interface HLSSourceProps {
  src: string;
  video: HTMLVideoElement | null;
  type?: string;
}

const HLSSource: React.FC<HLSSourceProps> = ({ src, video, type = 'application/x-mpegURL' }) => {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!video) return;

    if (Hls.isSupported()&&src) {
      hlsRef.current = new Hls({
        loader: CustomXhrLoader,
      });
      hlsRef.current.loadSource(src);
      hlsRef.current.attachMedia(video);
      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [src, video]);

    return <source src={src} type={type} />
};

export default HLSSource;
