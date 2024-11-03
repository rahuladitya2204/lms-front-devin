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
    // Predefined array of list markers
    const listMarkers = ['•', '*', '–', '▪', '•']; // You can add more markers as needed

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
