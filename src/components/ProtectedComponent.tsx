import { Button, Col, Modal, Row } from 'antd'
import React, { Fragment, useState } from 'react'

import ActionModal from './ActionModal/ActionModal'

interface ProtectedContentPropsI {
  children: React.ReactNode;
  cta: React.ReactNode;
  message?: React.ReactNode;
  isVerified?: boolean;
}

const ProtectedContent = (props: ProtectedContentPropsI) => {
  const { isVerified, cta, message, children } = props
  return (
    <div>
      <div style={{ filter: isVerified ? 'none' : 'blur(8px)' }}>
        {props.children}
      </div>
      {!isVerified && (
        <ActionModal
          title="Verification Required"
          open={true}
          closable={false}
          keyboardClosable={false}
        >
          <Fragment>
            <Row gutter={[20, 30]}>
              {message ? <Col span={24}>{message}</Col> : null}
              <Col span={24}>{cta}</Col>
            </Row>
          </Fragment>
        </ActionModal>
      )}
    </div>
  )
}

export default ProtectedContent
