import './style.css'

import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import React from 'react'

const PreviewWhatsappTemplate = ({ content }: any) => (
  <div id="whatsapp-chat">
    <div className="whatsapp-chat-header">
      <div className="whatsapp-chat-avatar">
        {/* <img
          src="https://files.elfsight.com/storage/9274ed8b-a2e8-4cf8-a4cf-fad383377f2b/7b75090c-19a2-452b-9d6b-c2a51ad4916f.jpeg"
          alt="Tedbree Logo"
        /> */}
      </div>
      <p>
        <span className="whatsapp-chat-name">Tedbree</span>
        <br />
        <small>Typically replies within an hour</small>
      </p>
    </div>
    <div className="start-chat">
      <div className="whatsapp-chat-body">
        {content ? (
          <div className="whatsapp-message-container">
            <div className="whatsapp-message">
              <HtmlViewer content={content} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  </div>
)

export default PreviewWhatsappTemplate
