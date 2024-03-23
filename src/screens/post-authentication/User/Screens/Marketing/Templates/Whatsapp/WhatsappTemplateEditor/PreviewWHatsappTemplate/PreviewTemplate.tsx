import './style.css'

import HtmlViewer from '@Components/HtmlViewer/HtmlViewer'
import OrgLogo from '@Components/OrgLogo'
import React from 'react'
import { User } from '@invinciblezealorg/lms-common'

const PreviewWhatsappTemplate = ({ content }: any) => {
  const { data: org } = User.Queries.useGetOrgDetails()
  return (
    <div id="whatsapp-chat">
      <div className="whatsapp-chat-header">
        <div className="whatsapp-chat-avatar">
          {/* <img
            src="https://files.elfsight.com/storage/9274ed8b-a2e8-4cf8-a4cf-fad383377f2b/7b75090c-19a2-452b-9d6b-c2a51ad4916f.jpeg"
            alt="Tedbree Logo"
          /> */}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <OrgLogo />
          <p style={{ marginLeft: 10 }}>
            <span className="whatsapp-chat-name">{org.name}</span>
            <br />
            <small>Typically replies within an hour</small>
          </p>
        </div>
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
}

export default PreviewWhatsappTemplate
