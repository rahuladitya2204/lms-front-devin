import { Common, Types } from '@adewaskar/lms-common'
import React, { useLayoutEffect, useState } from 'react'

import Viewer from 'pdf-viewer-reactjs'

interface PDFViewerPropsI {
  file: Types.FileType;
}

const PDFViewer = (props: PDFViewerPropsI) => {
  const { data: url } = Common.Queries.useGetPresignedUrl(props.file._id)

  const [isMounted, setIsMounted] = useState(false)

  console.log(url, 'url')
  console.log('huhuhu')

  useLayoutEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  return isMounted && url ? (
    <Viewer
      document={{
        url: url
        // url: 'https://arxiv.org/pdf/quant-ph/0410100.pdf'
      }}
    />
  ) : null
}

export default PDFViewer
