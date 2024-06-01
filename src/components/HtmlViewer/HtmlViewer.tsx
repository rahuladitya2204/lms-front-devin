import "./suneditor.css";
import { List, Rate, Typography, Image } from "antd";
import parse, { domToReact } from "html-react-parser";
import { Element } from "domhandler";
import styled from "@emotion/styled";
import "./style.css";
const StyledListItem = styled(List.Item)`
  p,
  div {
    margin: 0;
  }
`;

const { Title, Paragraph } = Typography;

interface HtmlViewerProps {
  content: string;
  noPreviewImage?: boolean;
  customStyles?: string;
}

function HtmlViewer(props: HtmlViewerProps) {
  const { content, noPreviewImage, customStyles } = props;

  if (!content) {
    return null;
  }

  const convertNodeToElement = (node: Element | Text, index: number) => {
    if (node.type === "tag") {
      switch (node.name) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          const level = parseInt(node.name.slice(1));
          return (
            <Title key={index} level={level}>
              {domToReact(node.children)}
            </Title>
          );
        case "p":
          return <Paragraph key={index}>{domToReact(node.children)}</Paragraph>;
        case "ul":
        case "ol":
          return (
            <List style={{ marginLeft: 15 }} key={index}>
              {node.children.map((child, childIndex) => {
                if (child.type === "tag" && child.name === "li") {
                  return (
                    <StyledListItem key={childIndex} style={{ margin: 0 }}>
                      <Paragraph>{domToReact(child.children)}</Paragraph>
                    </StyledListItem>
                  );
                }
                return null;
              })}
            </List>
          );
        case "img":
          const src = node.attribs.src;
          const alt = node.attribs.alt || "";
          return (
            <Image
              className="html-viewer-img"
              key={index}
              src={src}
              alt={alt}
              preview={!noPreviewImage}
            />
          );
        default:
          return <div key={index}>{domToReact(node.children)}</div>;
      }
    } else if (node.type === "text") {
      return <Paragraph key={index}>{node.data}</Paragraph>;
    }
    return null;
  };

  return (
    <div className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred">
      <div className="html-viewer">
        <style>{customStyles}</style>
        {parse(content, { replace: convertNodeToElement })}
      </div>
    </div>
  );
}

export default HtmlViewer;
