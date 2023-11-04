import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

import React, { useState } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'

import { Common } from '@adewaskar/lms-common'
import ErrorBoundary from './ErrorBoundary'
import { Spin } from 'antd'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

interface PDFViewerPropsI {
  file: { _id: string };
  onLoadingStarted?: () => void;
  onLoadingEnded?: () => void;
}

const PDFViewer = (props: PDFViewerPropsI) => {
  const [loading, setLoading] = useState(true)
  const {
    data: url,
    isFetching: loadingFile
  } = Common.Queries.useGetPresignedUrlFromFile(props.file._id, {
    enabled: !!props.file._id
  })

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <div
      className="pdf-container"
      style={{ height: '100%', overflow: 'scroll' }}
    >
      <ErrorBoundary>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          {url && (
            <Spin spinning={loading || loadingFile}>
              <div style={{ height: '100%' }}>
                <Viewer
                  fileUrl={url}
                  plugins={[defaultLayoutPluginInstance]}
                  onDocumentLoad={() => setLoading(false)}
                  onZoom={() => setLoading(false)}
                />
              </div>
            </Spin>
          )}
        </Worker>
      </ErrorBoundary>
    </div>
  )
}

export default PDFViewer
