import "./suneditor.css";
import { List, Typography, Table, Divider } from "antd";
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
  protected?: boolean;
  onHighlightClick?: (highlight: Types.CourseHighlight) => void;
  copyable?: boolean;
  highlights?: Types.CourseHighlight;
}

function HtmlViewerCopyable(props: HtmlViewerProps) {
  const { content, noPreviewImage, customStyles, protected: isProtected, highlights: initialHighlights = [] } = props;
  const highlights = [...initialHighlights].sort((a, b) => {
    const aStart = a.startOffset;
    const bStart = b.startOffset;
    return aStart - bStart;
  });
  // console.log(highlights, 'highlights')
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<Highlight[]>([]);
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
    // Predefined array of list markers
    const listMarkers = [<span style={{ display: 'block', width: 4, position: 'relative', top: 8, height: 4, background: '#000', borderRadius: '50%' }}></span>, '◦', '▪', '▫']; // You can add more markers if needed

    // Determine the marker for the current level
    const marker =
      level < listMarkers.length ? listMarkers[level] : listMarkers[listMarkers.length - 1];

    // Check if the list is ordered or unordered
    const isOrdered = node.name === 'ol';

    // Filter out 'li' elements for the list items
    const listItems = node.children
      .filter((child) => child.type === 'tag' && child.name === 'li')
      .map((child, idx) => {
        // Process 'li' elements
        const nestedLists = child.children.filter(
          (subChild) =>
            subChild.type === 'tag' &&
            (subChild.name === 'ul' || subChild.name === 'ol')
        );

        // Content of the list item excluding the nested lists
        const content = domToReact(
          child.children.filter((subChild) => !nestedLists.includes(subChild)),
          { replace: convertNodeToElement }
        );

        return (
          <List.Item key={idx}>
            <div style={{ display: 'flex' }}>
              {isOrdered ? (
                <span style={{ marginRight: '8px' }}>{idx + 1}.</span>
              ) : (
                <span style={{ marginRight: '8px', fontWeight: 'bold' }}>{marker}</span>
              )}
              <div>{content}</div>
            </div>
            {/* Render nested lists within the current list item */}
            {nestedLists.map((nestedList, nestedIdx) => (
              <div key={nestedIdx} style={{ paddingLeft: '16px' }}>
                {renderList(nestedList as Element, nestedIdx, level + 1)}
              </div>
            ))}
          </List.Item>
        );
      });

    // Process any 'ul' or 'ol' elements directly under the current node (not within 'li')
    const nestedListsDirectlyUnderNode = node.children.filter(
      (child) =>
        child.type === 'tag' &&
        (child.name === 'ul' || child.name === 'ol')
    );

    // Render the list and any nested lists
    return (
      <>
        {listItems.length > 0 && (
          <List
            itemLayout='vertical'
            key={index}
            style={{ margin: '16px 0' }}
            split={level === 0} // Show dividers only for top-level lists
          >
            {listItems}
          </List>
        )}
        {nestedListsDirectlyUnderNode.map((nestedList, idx) => (
          <div key={idx} style={{ paddingLeft: `${(level + 1) * 16}px` }}>
            {renderList(nestedList as Element, idx, level + 1)}
          </div>
        ))}
      </>
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
    const processedNodes = new Set();

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

        case "span": {
          const { style, className } = node.attribs;
          return (
            <span
              key={index}
              style={parseStyleString(style)}
              className={className}
            >
              {domToReact(node.children, { replace: convertNodeToElement })}
            </span>
          );
        }

        // Handle images (already a void element)
        case "img": {
          const src = node.attribs.src;
          const alt = node.attribs.alt || "";
          return <AppImage
            preview
            key={index}
            src={src}
            alt={alt}
          />
        }

        case "table": {
          const columns = [];
          const dataSource = [];
          const columnKeys = [];
          let headersProcessed = false;

          // Process header rows
          const processHeaderRow = (row) => {
            let cellIndex = 0;
            row.children.forEach((cell) => {
              if (
                cell.type === "tag" &&
                (cell.name === "th" || cell.name === "td")
              ) {
                const dataIndex = `col${cellIndex}`;
                const title = extractText(cell);
                columns.push({
                  title: title,
                  dataIndex: dataIndex,
                  key: dataIndex,
                });
                columnKeys.push(dataIndex);
                cellIndex++;
              }
            });
          };

          // Process data rows
          const processDataRow = (row, rowIndex) => {
            const rowData = { key: rowIndex };
            let cellIndex = 0;
            row.children.forEach((cell) => {
              if (
                cell.type === "tag" &&
                (cell.name === "td" || cell.name === "th")
              ) {
                const dataIndex = columnKeys[cellIndex] || `col${cellIndex}`;
                const cellContent = extractText(cell);
                rowData[dataIndex] = cellContent;
                cellIndex++;
              }
            });
            dataSource.push(rowData);
          };

          // Process table children
          node.children.forEach((child) => {
            if (child.type === "tag") {
              if (child.name === "thead") {
                // Process header rows
                child.children.forEach((row) => {
                  if (row.type === "tag" && row.name === "tr") {
                    processHeaderRow(row);
                  }
                });
                headersProcessed = true;
              } else if (child.name === "tbody") {
                // Process data rows
                child.children.forEach((row) => {
                  if (row.type === "tag" && row.name === "tr") {
                    if (!headersProcessed && columns.length === 0) {
                      processHeaderRow(row);
                      headersProcessed = true;
                    } else {
                      processDataRow(row, dataSource.length);
                    }
                  }
                });
              } else if (child.name === "tr") {
                // Process rows not wrapped in <thead> or <tbody>
                if (!headersProcessed && columns.length === 0) {
                  processHeaderRow(child);
                  headersProcessed = true;
                } else {
                  processDataRow(child, dataSource.length);
                }
              }
            }
          });

          return (
            <Table
              key={index}
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              bordered
              style={{ margin: "16px 0" }}
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
    }
    else if (node.type === "text") {
      const text = node.data;
      const matchingHighlights = highlights
        .filter(h => text.includes(h.selectedText))
        .sort((a, b) => text.indexOf(a.selectedText) - text.indexOf(b.selectedText));

      if (matchingHighlights.length > 0) {
        let lastIndex = 0;
        const fragments = [];

        matchingHighlights.forEach((highlight, i) => {
          const startIndex = text.indexOf(highlight.selectedText, lastIndex);
          if (startIndex > lastIndex) {
            fragments.push(text.substring(lastIndex, startIndex));
          }
          fragments.push(
            React.createElement('span', null,
              React.createElement('div', {
                className: 'ant-tooltip-open'
              },
                React.createElement('span', {
                  className: 'highlighted-text',
                  style: { backgroundColor: '#ffeb3b', cursor: 'pointer' },
                  onClick: () => props.onHighlightClick?.(highlight),
                  ...(highlight.text && { 'data-text': highlight.text })
                }, highlight.selectedText)
              )
            )
          );
          lastIndex = startIndex + highlight.selectedText.length;
        });

        if (lastIndex < text.length) {
          fragments.push(text.substring(lastIndex));
        }

        return React.createElement(React.Fragment, { key: index }, ...fragments);
      }
      return text;
    }
    return null;
  };
  const parsedContent = parse(content, { replace: convertNodeToElement });
  return isProtected ? (
    // Render content through CanvasRenderer when protected
    <div style={{ width: '100%' }}>
      <CanvasRenderer>
        <style>{customStyles}</style>
        {parsedContent}
      </CanvasRenderer>
    </div>
  ) : (
    // Render content normally when not protected
    <div suppressHydrationWarning ref={containerRef} className="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred">
      <div className="html-viewer">
        <style>
          {`
          .highlighted-text {
            background-color: #ffeb3b;
            padding: 2px 0;
          }
          ${customStyles}
        `}
        </style>
        {parsedContent}
      </div>
    </div>
  );
}

// const HtmlViewer = withNonCopyable(HtmlViewerCopyable);
const HtmlViewer = HtmlViewerCopyable

export default HtmlViewer;


// CanvasRenderer.tsx
import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import AppImage from "@Components/Image";
import Base64Image from "@User/Screens/ExtraComponents/Base64Image";
import { Types } from "@adewaskar/lms-common";

interface CanvasRendererProps {
  children: React.ReactNode;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const captureContent = async () => {
      if (containerRef.current && canvasRef.current) {
        try {
          // Reset rendered state when capturing starts
          setIsRendered(false);

          // Wait for fonts to load
          await document.fonts.ready;

          // Wait for images to load
          const images = containerRef.current.getElementsByTagName('img');
          await Promise.all(
            Array.from(images).map(
              (img) =>
                new Promise<void>((resolve) => {
                  if (img.complete) {
                    resolve();
                  } else {
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                  }
                })
            )
          );

          // Allow the DOM to update
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Get the dimensions of the container
          const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();

          // Get device pixel ratio
          const devicePixelRatio = window.devicePixelRatio || 1;

          // Capture the content using html2canvas
          const canvas = await html2canvas(containerRef.current, {
            backgroundColor: null,
            useCORS: true,
            scrollX: 0,
            scrollY: 0,
            scale: devicePixelRatio,
            width: containerWidth,
            height: containerHeight,
          });

          // Set the canvas dimensions
          canvasRef.current.width = canvas.width;
          canvasRef.current.height = canvas.height;

          // Set the canvas CSS dimensions to match the container
          canvasRef.current.style.width = `${containerWidth}px`;
          canvasRef.current.style.height = `${containerHeight}px`;

          // Draw the captured content onto the canvas
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, 0);
          }

          // Mark rendering as complete
          setIsRendered(true);

        } catch (error) {
          console.error('Error capturing canvas image:', error);
        }
      }
    };

    captureContent();
  }, [children]);

  return (
    <div style={{
      width: '100%',
      position: 'relative',
      maxWidth: '100%',
    }}>
      {/* Content container - visible until canvas is rendered */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          display: isRendered ? 'none' : 'block',
          overflowWrap: 'break-word',
          wordWrap: 'break-word'
        }}
      >
        {children}
      </div>

      {/* Canvas element - shown after rendering */}
      <canvas
        ref={canvasRef}
        style={{
          display: isRendered ? 'block' : 'none',
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
  );
};

const xpathUtils = {
  evaluateXPath(xpath: string, context: Node = document): Node | null {
    try {
      // Try different XPath result types
      const result = document.evaluate(
        xpath,
        context,
        null,
        XPathResult.ANY_TYPE, // Changed from FIRST_ORDERED_NODE_TYPE
        null
      );

      let node = null;
      switch (result.resultType) {
        case XPathResult.STRING_TYPE:
          return document.createTextNode(result.stringValue);
        case XPathResult.FIRST_ORDERED_NODE_TYPE:
        case XPathResult.ANY_UNORDERED_NODE_TYPE:
          return result.singleNodeValue;
        default:
          return result.iterateNext();
      }
    } catch (e) {
      console.error('XPath evaluation failed:', e);
      return null;
    }
  },

  createRange(
    startContainer: Node,
    startOffset: number,
    endContainer: Node,
    endOffset: number
  ): Range {
    const range = document.createRange();
    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
    return range;
  }
};