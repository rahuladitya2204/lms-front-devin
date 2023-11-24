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
  const children = props.children || props.content
  return <div className="html-viewer">{parse(children, options)}</div>
  // return (
  //   <div
  //     className="html-viewer"
  //     // className="sun-editor-editable"
  //     dangerouslySetInnerHTML={{
  //       __html: children
  //     }}
  //   />
  // )
}

export default HtmlViewer
