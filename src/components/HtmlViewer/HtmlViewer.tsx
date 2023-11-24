import './style.css'

import AppImage from '@Components/Image'
import { Image } from 'antd'
import parse from 'html-react-parser'

function HtmlViewer(props: { content: string }) {
  const options = {
    replace: (domNode: any) => {
      if (domNode.name === 'img' && domNode.attribs) {
        const style = domNode.attribs.style || ''
        const widthMatch = style.match(/width:\s*([0-9]+px)/)
        const heightMatch = style.match(/height:\s*([0-9]+px)/)
        const width = widthMatch ? widthMatch[1] : 'auto'
        const height = heightMatch ? heightMatch[1] : 'auto'
        return (
          <Image
            style={{
              width: width || 'auto',
              height: height || 'auto'
            }} // Apply the width to AppImage
            src={domNode.attribs.src}
            alt={domNode.attribs.alt || 'Image'}
            preview
          />
        )
      }
    }
  }

  // @ts-ignore
  const children = cleanContent(props.children || props.content || '')
  if (!children) {
    return null
  }
  return <div className="html-viewer">{parse(children, options)}</div>
}

export default HtmlViewer

const cleanContent = (htmlContent: string, tags=['div', 'span', 'p', 'svg', 'path','li']): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Check if a node is empty
  const isEmptyNode = (node: Node): boolean => {
    if (node.nodeName.toLowerCase() === 'svg' || node.nodeName.toLowerCase() === 'path') {
      return node.childNodes.length === 0 && (node as Element).attributes.length === 0;
    }
    return node.childNodes.length === 0 && node.textContent?.trim() === '';
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
