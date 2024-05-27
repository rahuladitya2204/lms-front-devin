import { Modal, Spin } from "antd";
import React, {
  ReactNode,
  Suspense,
  createContext,
  startTransition,
  useCallback,
  useContext,
  useState,
} from "react";

interface ModalContextType {
  openModal: (content: ReactNode, opts?: ActionModalPropsI) => void;
  hideModal: () => void;
  modalContent: ReactNode | null;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
  openModal?: Function;
}

interface ActionModalPropsI {
  closable?: boolean;
  onClose?: () => void;
  lazy?: boolean;
  title?: string | React.ReactNode;
  fullScreen?: boolean;
  width?: number;
  keyboardClosable?: boolean;
  height?: number;
  processing?: boolean;
  open?: boolean;
  cta?: React.ReactNode;
  footer?: (f: Function) => React.ReactNode[];
}
interface ModalStackItem {
  content: ReactNode;
  opts: ActionModalPropsI;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalStack, setModalStack] = useState<ModalStackItem[]>([]);

  const openModal = useCallback(
    (content: ReactNode, opts: ActionModalPropsI = {}) => {
      startTransition(() => {
        setModalStack((prevStack) => [...prevStack, { content, opts }]);
      });
    },
    []
  );

  const hideModal = useCallback(() => {
    setModalStack((prevStack) => prevStack.slice(0, -1));
  }, []);
  const renderContent = (modalItem: any) => {
    const CloseWithChildren = React.cloneElement(modalItem.content, {
      closeModal: hideModal,
      openModal,
    });
    // console.log(props.children.$$typeof, 'LKLK')
    if (modalItem.opts.lazy) {
      return (
        <Suspense fallback={<Spin size="large" />}>
          {CloseWithChildren}
        </Suspense>
      );
    }
    return CloseWithChildren;
  };
  return (
    // @ts-ignore
    <ModalContext.Provider value={{ openModal, hideModal, modalStack }}>
      {children}

      {modalStack.map((modalItem, index) => (
        <Modal
          key={index}
          open={true}
          onCancel={hideModal}
          bodyStyle={modalItem.opts.fullScreen ? { height: "80vh" } : {}}
          {...modalItem.opts}
          footer={
            modalItem.opts.footer ? modalItem.opts.footer(hideModal) : null
          }
        >
          {/* @ts-ignore */}
          {renderContent(modalItem)}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
};
