// Import Plyr styles
import './plyr.css'
import './style.css'

import  { APITypes, usePlyr } from 'plyr-react'
import React, { Fragment, useEffect, useLayoutEffect, useRef } from 'react'
import { Store, Types } from '@adewaskar/lms-common'

import { CustomXhrLoader } from './Hls'
import Hls from "hls.js";

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
    if (props.hls) {
      const loadVideo = async () => {
      const video = document.getElementById("plyr") as HTMLVideoElement;
      var hls = new Hls({
        loader: CustomXhrLoader,
      });
      hls.loadSource(props.url+'')
      hls.attachMedia(video);
      // @ts-ignore
      ref.current!.plyr.media = video;

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        // (ref.current!.plyr as PlyrInstance).play();
      });
    };
      loadVideo();
    }
  });

  return (
    <Plyr
      id="plyr"
      options={{ volume: 0.1 }}
      // @ts-ignore
      source={props.hls ? {} : {sources:[{ src: props.url }], type:'video'}}
      ref={ref}
    />
  );
};

const Plyr = React.forwardRef((props: any, ref) => {
  const setPlayer = Store.usePlayer(s => s.setPlayerState);
  const supported = Hls.isSupported();
  const { source, options = null, ...rest } = props;
  // console.log(supported,'sss')
  // @ts-ignore
  const raptorRef = usePlyr(ref, {
    source,
    options,
  })

  // console.log(raptorRef.current,'raptorRef')
  return (
    <Fragment>
      {supported ? <video ref={raptorRef} className="plyr-react plyr" {...rest} /> : "HLS is not supported in your browser"}
    </Fragment>
  );
})

export default PlyrComponent;