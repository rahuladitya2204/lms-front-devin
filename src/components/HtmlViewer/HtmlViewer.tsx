import "./suneditor.css";

import AppImage from "@Components/Image";
import AudioPlayer from "@Components/AudioPlayer";
import { Image } from "antd";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import parse from "html-react-parser";
import dynamic from "next/dynamic";

function HtmlViewer(props: { content: string; noPreviewImage?: boolean }) {
  const options = {
    replace: (domNode: any) => {
      // console.log(domNode,'domon')
      // if (domNode.name === "img" && domNode.attribs) {
      //   const style = domNode.attribs.style || "";
      //   console.log(style, "style");
      //   const widthMatch = style.match(/width:\s*([0-9]+px)/);
      //   const heightMatch = style.match(/height:\s*([0-9]+px)/);
      //   const width = widthMatch ? widthMatch[1] : "auto";
      //   const height = heightMatch ? heightMatch[1] : "auto";
      //   return (
      //     <Image
      //       style={{
      //         ...style,
      //         width: width || "auto",
      //         height: height || "auto",
      //       }} // Apply the width to AppImage
      //       src={domNode.attribs.src}
      //       alt={domNode.attribs.alt || "Image"}
      //       preview={!!props.noPreviewImage}
      //     />
      //   );
      // }
      if (domNode.name === "audio" && domNode.attribs) {
        const style = domNode.attribs.style || "";
        return (
          <AudioPlayer
            src={domNode.attribs.src}
            // preview
          />
        );
      }

      if (domNode.name === "video" && domNode.attribs) {
        const style = domNode.attribs.style || "";
        return (
          <MediaPlayer
            url={domNode.attribs.src}
            // preview
          />
        );
      }
    },
  };

  // @ts-ignore
  const children = cleanContent(props.children || props.content || "");
  if (!children) {
    return null;
  }
  return (
    <div className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred">
      <div className="html-viewer">{parse(children, options)}</div>
    </div>
  );
}

const cleanContent = (
  htmlContent: string,
  tags = ["div", "span", "p", "svg", "path", "li"]
): string => {
  // htmlContent = htmlContent.replace(/&nbsp;/g, '\t'); // Replace &nbsp; with \t (tab)
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  // Check if a node is empty
  const isEmptyNode = (node: Node): boolean => {
    return (
      node.childNodes.length === 0 && (node as Element).attributes.length === 0
    );
  };

  // Clean nodes recursively
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

export default dynamic(() => Promise.resolve(HtmlViewer), {
  ssr: false,
});
