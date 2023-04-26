// Import Plyr styles
import './plyr.css'
import './style.css'

import Plyr, { APITypes, PlyrInstance, PlyrProps } from 'plyr-react'
import { Store, Types } from '@adewaskar/lms-common'
import { useEffect, useLayoutEffect, useRef } from 'react'

import { CustomXhrLoader } from './Hls'
import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
import Hls from "hls.js";
import WatermarkPlugin from './useWatermark/Watermark'
import { htmlToText } from 'html-to-text'

interface VideoJsComponentPropsI {
  url?: string;
  watermark?: string | null;
  hls?: boolean;
  width?: number;
  height?: number;
  notes?: Types.CourseNote[];
  onEnded?: () => void;
}

const PlyrComponent = (props:VideoJsComponentPropsI) => {
  const ref = useRef<APITypes>(null);
  useEffect(() => {
    const loadVideo = async () => {
      const video = document.getElementById("plyr") as HTMLVideoElement;
      var hls = new Hls({
        loader: CustomXhrLoader,
      });
      // hls.loadSource("https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8");
      hls.loadSource(props.url+'')
      hls.attachMedia(video);
      // @ts-ignore
      ref.current!.plyr.media = video;

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        // (ref.current!.plyr as PlyrInstance).play();
      });
    };
    if (props.hls) {
      loadVideo();
    }
  });

  return (
    <Plyr
      id="plyr"
      options={{ volume: 0.1 }}
      // @ts-ignore
      source={true?({} as PlyrProps["source"]):{sources: [{ src: props.url }]}}
      ref={ref}
    />
  );
};

export default function App(props:VideoJsComponentPropsI) {
  const supported = Hls.isSupported();

  return (
    <div>
      {supported ? <PlyrComponent {...props} /> : "HLS is not supported in your browser"}
    </div>
  );
}
