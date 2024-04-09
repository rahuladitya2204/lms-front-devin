import { Col, Modal, Row, Spin } from "@Lib/index";
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
    // console.log(props.children.$$typeof, 'LKLK')
    if (isLazyLoaded) {
      return (
        <Suspense fallback={<Spin size="large" />}>
          {CloseWithChildren}
        </Suspense>
      );
    }
    return CloseWithChildren;
  };
  return (
    <Fragment>
      <Spin style={{ display: "inline-block" }} spinning={isPending}>
        {/* <Spin spinning={true}> */}
        <span onClick={() => startTransition(() => setIsModalOpen(true))}>
          {props.cta}
        </span>
        <Modal
          keyboard={!!props.keyboardClosable && !props.processing}
          maskClosable={false}
          closable={!!props.closable || !props.processing}
          width={props.width}
          footer={props.footer ? props.footer(closeModal) : null}
          title={props.title}
          open={isModalOpen}
          onCancel={closeModal}
          style={{ minHeight: props.minHeight || "auto" }}
        >
          <Row
            style={{ minHeight: props.minHeight || "auto" }}
            justify={"center"}
            align={"middle"}
          >
            <Col>{renderContent()}</Col>
          </Row>
        </Modal>
      </Spin>
    </Fragment>
  );
}
function identifyVariable(variable: any) {
  // Check for a React lazy-loaded component
  if (typeof variable === "object" && variable !== null) {
    if (variable.$$typeof === Symbol.for("react.lazy")) {
      return "promise";
    }
  }

  // Other checks
  if (typeof variable === "function") {
    return "function";
  } else {
    return typeof variable;
  }
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
}
