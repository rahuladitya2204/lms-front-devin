import { Modal } from 'antd'
import { Fragment, useState } from 'react'

interface ActionModalPropsI {
  children?: React.ReactNode;
  onClose?: () => void;
  title?: string;
  cta?: React.ReactNode;
  footer?: (f: Function) => React.ReactNode[];
}

function ActionModal(props: ActionModalPropsI) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    props.onClose && props.onClose()
  }
  return (
    <Fragment>
      <span onClick={showModal}>{props.cta}</span>
      <Modal
        footer={props.footer ? props.footer(closeModal): null}
        style={{ minWidth: 750 }}
        title={props.title}
        open={isModalOpen}
        onCancel={closeModal}
      >
        {props.children}
      </Modal>
    </Fragment>
  )
}

export default ActionModal
