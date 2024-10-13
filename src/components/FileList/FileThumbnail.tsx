import React from "react";
import { Avatar } from "antd";
import { FileTwoTone, PlayCircleTwoTone } from "@ant-design/icons";
import AppImage from "@Components/Image";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";

interface FileThumbnailPropsI {
  url: string;
}

const FileThumbnail = ({ url }: FileThumbnailPropsI) => {
  // Extract file extension from URL
  const fileExtension = url?.split(".").pop()?.toLowerCase();
  console.log(url, "urlurl");
  // Render an image thumbnail if the file is an image
  if (["jpg", "jpeg", "png", "gif", "bmp", "svg"].includes(fileExtension)) {
    return <AppImage src={url} height={200} />;
  }

  // Render a video thumbnail if the file is a video
  if (["mp4", "mkv", "mov", "avi"].includes(fileExtension)) {
    return (
      <Avatar
        shape="square"
        style={{ width: 50, height: 50 }}
        src={<MediaPlayer url={url} />}
      />
    );
  }

  // Default file icon for other file types
  return (
    <Avatar shape="square" icon={<FileTwoTone style={{ fontSize: 25 }} />} />
  );
};

export default FileThumbnail;
