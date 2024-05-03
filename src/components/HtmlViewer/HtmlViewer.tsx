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

const cleanContent = (
  htmlContent: string,
  tags = ["div", "span", "p", "svg", "path", "li"]
): string => {
  const getDOMParser = () => {
    if (typeof window === "undefined") {
      // Server-side (Node.js)
      const { JSDOM } = require("jsdom");
      return new JSDOM().window.DOMParser;
    } else {
      // Client-side (browser)
      return window.DOMParser;
    }
  };

  const DOMParser = getDOMParser();
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  const isEmptyNode = (node: Node): boolean => {
    return (
      node.childNodes.length === 0 && (node as Element).attributes.length === 0
    );
  };

  const cleanNode = (node: Node): void => {
    Array.from(node.childNodes).forEach((child) => {
      cleanNode(child);
      if (tags.includes(child.nodeName.toLowerCase()) && isEmptyNode(child)) {
        node.removeChild(child);
      }
    });
  };

  cleanNode(doc.body);

  return doc.body.innerHTML;
};

export default HtmlViewer;
