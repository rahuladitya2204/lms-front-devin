import React from 'react'
import "./suneditor.css";
import { List, Typography, Image, Table, Divider } from "antd";
import parse, { domToReact, DOMNode } from "html-react-parser";
import { Element } from "domhandler";
import styled from "@emotion/styled";
import "./style.css";
import withNonCopyable from "../withNoncopyable";


const { Title, Paragraph } = Typography;

interface HtmlViewerProps {
  content: string;
  noPreviewImage?: boolean;
  customStyles?: string;
}

function HtmlViewerCopyable(props: HtmlViewerProps) {
  const { content, noPreviewImage, customStyles } = props;

  if (!content) {
    return null;
  }

  // Helper function to parse inline styles
  const parseStyleString = (styleString: string) => {
    if (!styleString) return undefined;
    return styleString.split(";").reduce((styleObject, styleProperty) => {
      const [key, value] = styleProperty.split(":");
      if (key && value) {
        const formattedKey = key
          .trim()
          .replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        styleObject[formattedKey] = value.trim();
      }
      return styleObject;
    }, {});
  };

  // Helper function to extract text from a node
  const extractText = (node: DOMNode): string => {
    if (node.type === "text") {
      return node.data;
    } else if (node.type === "tag" && node.children) {
      return node.children.map(extractText).join("");
    }
    return "";
  };

  const renderList = (node: Element, index: number, level = 0) => {
    const isOrdered = node.name === "ol";

    // Extract list items
    const items = node.children
      .filter((child) => child.type === "tag" && (child.name === "li" || child.name === "ul" || child.name === "ol"))
      .map((child, idx) => {
        if (child.name === "li") {
          // Find any nested lists within this list item
          const nestedLists = child.children.filter(
            (subChild) =>
              subChild.type === "tag" &&
              (subChild.name === "ul" || subChild.name === "ol")
          );

          // Content of the list item excluding the nested lists
          const content = domToReact(
            child.children.filter((subChild) => !nestedLists.includes(subChild)),
            { replace: convertNodeToElement }
          );

          return (
            <List.Item key={idx}>
              <div style={{ display: "flex" }}>
                {isOrdered ? (
                  <span style={{ marginRight: "8px" }}>{idx + 1}.</span>
                ) : (
                  <span style={{ marginRight: "8px", fontWeight: "bold" }}>•</span>
                )}
                <div>{content}</div>
              </div>
              {/* Render nested lists within the current list item */}
              {nestedLists.map((nestedList, nestedIdx) => (
                <div key={nestedIdx} style={{ paddingLeft: "16px" }}>
                  {renderList(nestedList as Element, nestedIdx, level + 1)}
                </div>
              ))}
            </List.Item>
          );
        } else if (child.name === "ul" || child.name === "ol") {
          // Directly render nested lists
          return (
            <div key={idx} style={{ paddingLeft: `${(level + 1) * 16}px` }}>
              {renderList(child, idx, level + 1)}
            </div>
          );
        } else {
          // Handle other tags if necessary
          return null;
        }
      });

    // Return the List component with the 'split' prop set based on the level
    return (
      <List
        itemLayout="vertical"
        key={index}
        dataSource={items}
        renderItem={(item) => item}
        style={{ margin: "16px 0" }}
        split={level === 0} // Show dividers only for top-level lists
      />
    );
  };


  // List of void elements
  const voidElements = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ]);

  const convertNodeToElement = (node: Element | Text, index: number) => {
    if (node.type === "tag") {
      // Handle void elements
      if (voidElements.has(node.name)) {
        return React.createElement(
          node.name,
          {
            key: index,
            ...node.attribs,
            style: parseStyleString(node.attribs.style),
          },
          null
        );
      }

      switch (node.name) {
        // Handle headings
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6": {
          const level = parseInt(node.name.slice(1));
          return (
            <Title
              key={index}
              level={level}
              style={parseStyleString(node.attribs.style)}
            >
              {domToReact(node.children, { replace: convertNodeToElement })}
            </Title>
          );
        }

        // Handle paragraphs
        case "p":
          return (
            <Paragraph
              key={index}
              style={parseStyleString(node.attribs.style)}
            >
              {domToReact(node.children, { replace: convertNodeToElement })}
            </Paragraph>
          );

        // Handle images (already a void element)
        case "img": {
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
        }

        // Handle tables
        case "table": {
          // Your existing table processing logic
          // ...
          return (
            <Table
              key={index}
            // ...other props
            />
          );
        }

        // Handle lists
        case "ul":
        case "ol": {
          return renderList(node, index);
        }

        case "hr": {
          return <Divider key={index} />;
        }

        // Handle inline elements and preserve styles
        case "span":
        case "strong":
        case "em":
        case "b":
        case "i":
        case "u": {
          const { style, class: className } = node.attribs;
          const Tag = node.name;
          return (
            <Tag
              key={index}
              style={parseStyleString(style)}
              className={className}
            >
              {domToReact(node.children, { replace: convertNodeToElement })}
            </Tag>
          );
        }

        // Default case: create the element and process its children
        default:
          return React.createElement(
            node.name,
            {
              key: index,
              ...node.attribs,
              style: parseStyleString(node.attribs.style),
            },
            domToReact(node.children, { replace: convertNodeToElement })
          );
      }
    } else if (node.type === "text") {
      return node.data;
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

const HtmlViewer = withNonCopyable(HtmlViewerCopyable);

export default HtmlViewer;
