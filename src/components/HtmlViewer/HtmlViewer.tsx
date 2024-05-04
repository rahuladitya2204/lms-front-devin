import "./suneditor.css";

import AppImage from "@Components/Image";
import AudioPlayer from "@Components/AudioPlayer";
import { Image } from "antd";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import parse from "html-react-parser";
import dynamic from "next/dynamic";

function HtmlViewer(props: { content: string; noPreviewImage?: boolean }) {
  // @ts-ignore
  const children = props.children || props.content;
  if (!children) {
    return null;
  }
  return (
    <div className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred">
      <div
        className="html-viewer"
        dangerouslySetInnerHTML={{ __html: children }}
      ></div>
    </div>
  );
}

export default HtmlViewer;
