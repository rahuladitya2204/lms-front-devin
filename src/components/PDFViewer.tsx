import React, { useState } from 'react'
import { Common } from '@adewaskar/lms-common'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { Spin } from 'antd'

interface PDFViewerPropsI {
  file: { _id: string };
  onLoadingStarted?: () => void;
  onLoadingEnded?: () => void;
}

const PDFViewer = (props: PDFViewerPropsI) => {
  const [loading, setLoading] = useState(true)
  const {
    data: url,
    isLoading: loadingFile
  } = Common.Queries.useGetPresignedUrlFromFile(props.file._id, {
    enabled: !!props.file._id
  })

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  return (
    <div
      className="pdf-container"
      style={{ height: '100%', overflow: 'scroll' }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
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
    </div>
  )
}

export default PDFViewer
