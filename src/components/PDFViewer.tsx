import { Common, Types } from '@adewaskar/lms-common'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'

import React from 'react';

interface PDFViewerPropsI {
  file: Types.FileType;
}

const PDFViewer = (props: PDFViewerPropsI) => {
  const { data: url } = Common.Queries.useGetPresignedUrl(props.file._id)

  const [numPages, setNumPages] = React.useState(null)

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages)
  }

  return (
    <div>
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  )
}

export default PDFViewer;