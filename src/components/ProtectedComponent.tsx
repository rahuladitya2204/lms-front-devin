import { Button, Col, Modal, Row } from 'antd'
import React, { Fragment, useState } from 'react'

import ActionModal from './ActionModal/ActionModal'

interface ProtectedContentPropsI {
  children: React.ReactNode;
  cta?: React.ReactNode;
  message?: React.ReactNode;
  isVerified?: boolean;
  title?: React.ReactNode;
  width?: number;
}

const ProtectedContent = (props: ProtectedContentPropsI) => {
  const { isVerified, cta, message, children, title } = props
  return (
    <div>
      <div style={{ filter: isVerified ? 'none' : 'blur(8px)' }}>
        {props.children}
      </div>
      {!isVerified && (
        <Modal
          title={title}
          open={true}
          closable={false}
          footer={null}
          width={props.width}
          // keyboardClosable={false}
        >
          <Fragment>
            <Row gutter={[20, 30]}>
              {message ? <Col span={24}>{message}</Col> : null}
              <Col span={24}>{cta}</Col>
            </Row>
          </Fragment>
        </Modal>
      )}
    </div>
  )
}

export default ProtectedContent
