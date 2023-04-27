// @ts-nocheck
// Import Plyr styles
import './plyr.css'
import './style.css'

import React, {
  useEffect,
  useRef,
} from 'react'
import { Store, Types } from '@adewaskar/lms-common'

import { CustomXhrLoader } from './Hls'
import Hls from 'hls.js'
import Plyr from 'plyr'
import { htmlToText } from 'html-to-text'

// import 'plyr/dist/plyr.css'

interface VideoJsComponentPropsI {
  url?: string;
  watermark?: string | null;
  hls?: boolean;
  width?: number;
  height?: number;
  notes?: Types.CourseNote[];
  onEnded?: () => void;
}
const PlyrComponent = (props: VideoJsComponentPropsI) => {
  const setPlayer = Store.usePlayer(s => s.setPlayerState);
  const videoRef = useRef(null)
  const plyrRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      plyrRef.current = new Plyr('#playrrr', {
        volume: 0.1,
      })
      plyrRef.current.on('timeupdate', e => {
        setPlayer({
          currentTime: Math.ceil(plyrRef.current.currentTime)
        })
      })
    }

    return () => {
      if (plyrRef.current) {
        plyrRef.current.destroy()
        plyrRef.current = null
      }
    }
  }, []);

  useEffect(() => {
    console.log(props.notes,'props.notesprops.notes')
    const points = (props.notes || []).map(n => {
      return {
        time: n.time,
        label: htmlToText(n.content)
      }
    });
    console.log(points,'markekeker')
    plyrRef.current.config.markers = { enabled: !!points.length, points: points };
  },[props.notes])

  useEffect(() => {
      if (props.hls) {
        const loadVideo = async () => {
        const video = document.getElementById("playrrr") as HTMLVideoElement;
        var hls = new Hls({
          loader: CustomXhrLoader,
        });
        hls.loadSource(props.url+'')
        hls.attachMedia(video);
        // @ts-ignore
        // ref.current!.plyr.media = video;
  
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          // (ref.current!.plyr as PlyrInstance).play();
        });
      };
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
          // poster: '/path/to/poster.jpg',
          // previewThumbnails: {
          //   src: '/path/to/thumbnails.vtt',
          // },
          // tracks: [
          //   {
          //     kind: 'captions',
          //     label: 'English',
          //     srclang: 'en',
          //     src: '/path/to/captions.en.vtt',
          //     default: true,
          //   },
          //   {
          //     kind: 'captions',
          //     label: 'French',
          //     srclang: 'fr',
          //     src: '/path/to/captions.fr.vtt',
          //   },
          // ],
        };
    }
  },[props.hls,props.url])

  return (
    <div>
      <video
        ref={videoRef}
        className="plyr"
        controls
        preload="none"
        poster="your_poster_image_url"
        id="playrrr"
      >
        {!props.hls ? <source src={props.url}/>:null}
      </video>
    </div>
  )
}

export default PlyrComponent
