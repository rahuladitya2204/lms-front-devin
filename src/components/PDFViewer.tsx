import React from 'react'
import Viewer from 'pdf-viewer-reactjs'

interface PDFViewerPropsI {
  url: string;
}

const PDFViewer = (props: PDFViewerPropsI) => {
  console.log('huhuhu')
  return (
    <Viewer
      document={{
        url: props.url
        // url: 'https://arxiv.org/pdf/quant-ph/0410100.pdf'
      }}
    />
  )
}

export default PDFViewer
