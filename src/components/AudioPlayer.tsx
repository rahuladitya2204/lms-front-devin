"use client";
import "react-h5-audio-player/lib/styles.css";

import React from "react";
import ReactAudioPlayer from "react-h5-audio-player";

interface AudioPlayerProps {
  src: string; // URL of the audio file
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  return (
    <ReactAudioPlayer
      preload="auto"
      src={src}
      //   controls
      style={{ width: "100%" }}
    />
  );
};

export default AudioPlayer;
