import { Common, Types } from '@adewaskar/lms-common'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'
import React, { useState } from 'react'

import { Spin } from 'antd'

interface PDFViewerPropsI {
  file: Types.FileType;
}

const PDFViewer = (props: PDFViewerPropsI) => {
  const [loading, setLoading] = useState(true)
  const { data: url } = Common.Queries.useGetPresignedUrl(props.file._id)

  const [numPages, setNumPages] = React.useState(null)

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages)
    setLoading(false)
  }

  return (
    <Spin spinning={loading}>
      <div>
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              onLoadSuccess={e => console.log(e, 'csss')}
              key={`page_${index + 1}`}
              pageNumber={index + 1}
            />
          ))}
        </Document>
      </div>
    </Spin>
  )
}

export default PDFViewer
