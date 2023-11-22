import React, { Fragment, useEffect, useRef, useState } from 'react'

import { Modal } from 'antd'

interface ActionModalPropsI {
  children?: any;
  closable?: boolean;
  onClose?: () => void;
  title?: string | React.ReactNode;
  width?: number;
  keyboardClosable?: boolean;
  height?: number;
  processing?: boolean;
  open?: boolean;
  cta?: React.ReactNode;
  footer?: (f: Function) => React.ReactNode[];
}

function ActionModal(props: ActionModalPropsI) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  useEffect(
    () => {
      setIsModalOpen(!!props.open)
    },
    [props.open]
  )

  const closeModal = () => {
    setIsModalOpen(false)
    props.onClose && props.onClose()
  }
  const childrenWithCloseModal = React.cloneElement(props.children, {
    closeModal
  })
  return (
    <Fragment>
      <span onClick={showModal}>{props.cta}</span>
      <Modal
        keyboard={!!props.keyboardClosable && !props.processing}
        maskClosable={false}
        closable={!!props.closable || !props.processing}
        width={props.width}
        footer={props.footer ? props.footer(closeModal) : null}
        title={props.title}
        open={isModalOpen}
        onCancel={closeModal}
      >
        {isModalOpen && childrenWithCloseModal}
      </Modal>
    </Fragment>
  )
}

export default ActionModal

export interface ActionModalI {
  closeModal?: () => void;
}

// export const openActionModal = (Component: React.ReactNode) => {
//   const CtaRef = useRef(null)
//   return <ActionModal cta={<span ref={CtaRef} />}>{Component}</ActionModal>
// }
