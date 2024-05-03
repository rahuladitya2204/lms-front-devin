import "./suneditor.css";
import AudioPlayer from "@Components/AudioPlayer";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import parse from "html-react-parser";
import cheerio from "cheerio";

function HtmlViewer(props: { content: string; noPreviewImage?: boolean }) {
  const options = {
    replace: (domNode: any) => {
      if (domNode.name === "audio" && domNode.attribs) {
        return <AudioPlayer src={domNode.attribs.src} />;
      }
      if (domNode.name === "video" && domNode.attribs) {
        return <MediaPlayer url={domNode.attribs.src} />;
      }
    },
  };

  const cleanedContent = cleanContent(props.content || "");
  if (!cleanedContent) {
    return null;
  }

  return (
    <div className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred">
      <div className="html-viewer">{parse(cleanedContent, options)}</div>
    </div>
  );
}

const cleanContent = (htmlContent: string): string => {
  const $ = cheerio.load(htmlContent);

  // Remove empty tags
  $("div, span, p, svg, path, li").each((_, el) => {
    if ($(el).is(":empty")) {
      $(el).remove();
    }
  });

  return $.html();
};

export default HtmlViewer;
