import Player from 'video.js/dist/types/player'
import { Types } from '@invinciblezealorg/lms-common'

interface Marker {
  text: string;
  time: number;
}

export const initMarkers = (player: Player, markers: Marker[]) => {
  // @ts-ignore
  player.markers({
    markerStyle: {
      width: '7px',
      'border-radius': '30%',
      'background-color': 'red'
    },
    markerTip: {
      display: true,
      text: function(marker: Marker) {
        return marker.text
      },
      time: function(marker: Marker) {
        return marker.time
      }
    },
    breakOverlay: {
      display: false,
      displayTime: 3,
      style: {
        width: '100%',
        height: '20%',
        'background-color': 'rgba(0,0,0,0.7)',
        color: 'white',
        'font-size': '17px'
      },
      text: function(marker: Marker) {
        // @ts-ignore
        return 'Break overlay: ' + marker.overlayText
      }
    },
    onMarkerClick: function(marker: Marker) {},
    onMarkerReached: function(marker: Marker) {},
    markers: markers
    //       [
    //   {
    //     time: 9.5,
    //     text: 'marker',
    //     overlayText: 'overlay',
    //     class: 'custom-marker'
    //   }
    // ]
  })
}
