import { Document, Page } from 'react-pdf'

import { useState } from 'react'

interface PDFViewerPropsI {
  url: string;
}

function PDFViewer(props: PDFViewerPropsI) {
  const [numPages, setNumPages] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  return (
    <div>
      <Document file={props.url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  )
}

export default PDFViewer
