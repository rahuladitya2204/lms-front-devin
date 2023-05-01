import React, { Fragment, useEffect, useState } from 'react'

import { Modal } from 'antd'

interface ActionModalPropsI {
  children?: any;
  onClose?: () => void;
  title?: string | React.ReactNode;
  width?: number;
  open?: boolean;
  cta?: React.ReactNode;
  footer?: (f: Function) => React.ReactNode[];
}

function ActionModal(props: ActionModalPropsI) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  useEffect(()=>{
    setIsModalOpen(!!props.open);
  },[props.open])

  const closeModal = () => {
    setIsModalOpen(false)
    props.onClose && props.onClose()
  }
  return (
    <Fragment>
      <span onClick={showModal}>{props.cta}</span>
      <Modal
        width={props.width}
        footer={props.footer ? props.footer(closeModal) : null}
        title={props.title}
        open={isModalOpen}
        onCancel={closeModal}
      >
        {React.cloneElement(props.children, { closeModal })}
      </Modal>
    </Fragment>
  )
}

export default ActionModal
