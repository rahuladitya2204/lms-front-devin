import { Col, Modal, Row, Spin } from "antd";
import React, {
  Fragment,
  Suspense,
  useEffect,
  useState,
  useTransition,
} from "react";

function ActionModal(props: ActionModalI) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (props.open) {
      startTransition(() => {
        setIsModalOpen(true);
      });
    } else {
      setIsModalOpen(false);
    }
  }, [props.open, startTransition]);

  const closeModal = () => {
    setIsModalOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  };

  const isLazyLoaded = !!props.lazy;
  const CloseWithChildren = React.cloneElement(props.children, {
    closeModal,
  });
  const renderContent = () => {
    if (isLazyLoaded) {
      return (
        <Suspense fallback={<Spin size="large" />}>
          {CloseWithChildren}
        </Suspense>
      );
    }
    return CloseWithChildren;
  };

  const modalStyle = props.fullscreen
    ? {
      position: "fixed",
      top: "10px",
      left: "10px",
      right: "10px",
      bottom: "10px",
      margin: "auto",
      padding: "0", // Optional: Removes extra padding
      width: "auto", // Allows flexibility in width
      height: "auto", // Allows flexibility in height
      maxWidth: "calc(100% - 20px)",
      maxHeight: "calc(100% - 20px)",
      overflow: "auto", // Ensures content scrolls if necessary
    }
    : {
      minHeight: props.minHeight || "auto",
    };

  return (
    <Fragment>
      <Spin style={{ display: "inline-block" }} spinning={isPending}>
        <span onClick={() => startTransition(() => setIsModalOpen(true))}>
          {props.cta}
        </span>
        <Modal
          keyboard={!!props.keyboardClosable && !props.processing}
          maskClosable={false}
          closable={!!props.closable || !props.processing}
          width={props.fullscreen ? "100%" : props.width}
          footer={props.footer ? props.footer(closeModal) : null}
          title={props.title}
          open={isModalOpen}
          onCancel={closeModal}
          style={modalStyle}
        >
          <Row
            style={{ minHeight: props.minHeight || "auto" }}
            justify={"center"}
            align={"middle"}
          >
            <Col span={24}>{renderContent()}</Col>
          </Row>
        </Modal>
      </Spin>
    </Fragment>
  );
}

export default React.memo(ActionModal);

export interface ActionModalI {
  children?: any;
  closable?: boolean;
  onClose?: () => void;
  title?: string | React.ReactNode;
  width?: number;
  keyboardClosable?: boolean;
  height?: number;
  processing?: boolean;
  closeModal?: Function;
  open?: boolean;
  minHeight?: number;
  cta?: React.ReactNode;
  lazy?: boolean;
  footer?: (f: Function) => React.ReactNode[];
  fullscreen?: boolean; // New prop for fullscreen mode
}
