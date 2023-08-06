// @ts-nocheck
// Import Plyr styles
import './plyr.css'
import './style.css'

import React, {
  useEffect,
  useRef,
  useState,
} from 'react'
import { Store, Types } from '@adewaskar/lms-common'

import { CustomXhrLoader } from './Hls'
import Hls from 'hls.js'
import { LiveCaption } from './Caption'
import Plyr from 'plyr'
import { htmlToText } from 'html-to-text'
import ErrorBoundary from '@Components/ErrorBoundary'

// import 'plyr/dist/plyr.css'

interface VideoJsComponentPropsI {
  url?: string;
  watermark?: string | null;
  thumbnail?: string;
  platform?: string;
  width?: number;
  height?: number;
  notes?: Types.CourseNote[];
  onEnded?: () => void;
}
const PlyrComponent = (props: VideoJsComponentPropsI) => {
  const isHls = props.url?.includes('.m3u8');
  const hlsRef = useRef(null);
  const setPlayer = Store.usePlayer(s => s.setPlayerState);
  const videoRef = useRef(null)
  const plyrRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      // const liveCaption = new LiveCaption();
      plyrRef.current = new Plyr('#playrrr', {
        volume: 0.1,
      })
      
      setPlayer({
        playerInstance:plyrRef.current,
      })
      plyrRef.current.on('timeupdate', e => {
        const duration = Math.ceil(plyrRef.current.duration);
        const currentTime = Math.ceil(plyrRef.current.currentTime);
        const progress=(currentTime / duration) * 100;
        setPlayer({
          currentTime,
          progress,
        })
      })

      plyrRef.current.on('play', e => {
        setPlayer({
          playing:true
        });
        // if(isHls){
          // hlsRef.current.attachMedia(video)
        // }
        // liveCaption.start();
      })

      plyrRef.current.on('pause', e => {
        setPlayer({
          playing:false
        })
      //  liveCaption.stop();
      })
    }

    return () => {
      if (plyrRef.current) {
        plyrRef?.current?.destroy()
        plyrRef.current = null;
        setPlayer({
          currentTime: null
        })
      }
    }
  }, []);

  useEffect(() => { 
    if (props.thumbnail) {
      plyrRef.current.poster = props.thumbnail;
    }
  },[props.thumbnail,plyrRef.current])

  useEffect(() => {

    const points = (props.notes || []).map(n => {
      return {
        time: n.time,
        label: htmlToText(n.content)
      }
    });

    plyrRef.current.config.markers = { enabled: !!points.length, points: points };
  },[props.notes])

  useEffect(() => {
    const loadVideo = async () => {
      const video = document.getElementById("playrrr") as HTMLVideoElement;
      var hls = new Hls({
        loader: CustomXhrLoader,
      });
      hls.loadSource(props.url + '')
      
      // plyrRef.current.on('play', () => {
        hls.attachMedia(video);
      // })
      
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        if (props.thumbnail) {
          video.setAttribute('poster', props.thumbnail);
        }
        // (ref.current!.plyr as PlyrInstance).play();
      });
    };
    if (isHls) {
      loadVideo();
    }
    else {
      plyrRef.current.source = {
        type: 'video',
        // title: 'Example title',
        sources: [
          {
            src: props.url
          }
        ],
      };
    }
  }, [isHls, props.url]);


  useEffect(() => {
    if (props.url?.includes('youtube.com')) {
      const youtubeVideoId = new URLSearchParams(new URL(props.url).search).get('v');
      plyrRef.current.source = {
        type: 'video',
        sources: [{
          src: youtubeVideoId,
          provider: 'youtube',
        }],
      };
    }

    if (props.url?.includes("vimeo.com")) {
      const vimeoVideoId = new URL(props.url).pathname.split("/").pop();
      plyrRef.current.source = {
        type: 'video',
        sources: [{
          src: vimeoVideoId,
          provider: 'vimeo',
        }],
      };
    }
  }, [props.url]);

  return (
    <ErrorBoundary>
      {isHls?<video
        ref={videoRef}
        className="plyr"
        controls
        preload="none"
        poster="your_poster_image_url"
        id="playrrr"
      >
      </video>: <video
        ref={videoRef}
        className="plyr"
        controls
        preload="none"
        poster="your_poster_image_url"
        id="playrrr"
      >
       <source src={props.url} />
      </video>}
      <div id="captions" class="captions"></div>
    </ErrorBoundary>
  )
}

export default PlyrComponent
