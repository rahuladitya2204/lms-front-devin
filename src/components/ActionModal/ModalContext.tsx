import { Modal, Spin } from "antd";
import React, {
  ReactNode,
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const NEXT_MODAL_DELAY = 2000; // 2-second delay between modal openings

interface ModalContextType {
  openModal: (content: ReactNode, opts?: ActionModalPropsI) => void;
  hideModal: () => void;
  modalStack: ModalStackItem[];
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("`useModal` must be used within a `ModalProvider`.");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

interface ActionModalPropsI {
  priority?: number; // Priority of the modal (default: 1)
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
  footer?: (close: Function) => React.ReactNode[];
}

interface ModalStackItem {
  content: ReactNode;
  opts: ActionModalPropsI;
  priority: number;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalStack, setModalStack] = useState<ModalStackItem[]>([]);
  const [modalQueue, setModalQueue] = useState<ModalStackItem[]>([]);
  const initializedRef = useRef(false); // Ensure singleton initialization

  useEffect(() => {
    if (initializedRef.current) {
      console.warn("ModalProvider is already initialized. Avoid multiple instances.");
    } else {
      initializedRef.current = true;
      // console.log("[MODAL PROVIDER]: Initialized successfully.");
    }
  }, []);

  const getCurrentHighestPriority = useCallback(() => {
    return modalStack.reduce(
      (max, item) => Math.max(max, item.priority),
      0
    );
  }, [modalStack]);

  const openModal = useCallback(
    (content: ReactNode, opts: ActionModalPropsI = {}) => {
      const priority = opts.priority ?? 1;
      const currentHighestPriority = getCurrentHighestPriority();

      console.log(
        `Attempting to open modal with priority ${priority}. Current highest priority: ${currentHighestPriority}`
      );

      if (priority >= currentHighestPriority) {
        console.log(`Opening modal with priority ${priority}.`);
        setModalStack((prev) => [...prev, { content, opts, priority }]);
      } else {
        console.log(
          `Queuing modal with priority ${priority} since a higher-priority modal is active.`
        );
        setModalQueue((prev) => [...prev, { content, opts, priority }]);
      }
    },
    [getCurrentHighestPriority]
  );

  const hideModal = useCallback(() => {
    console.log("Hiding the topmost modal.");
    setModalStack((prev) => prev.slice(0, -1));

    if (modalStack.length === 1 && modalQueue.length > 0) {
      console.log(
        `Opening next modal from queue after ${NEXT_MODAL_DELAY}ms delay.`
      );

      const nextModal = modalQueue[0];
      setTimeout(() => {
        setModalQueue((prev) => prev.slice(1));
        setModalStack((prev) => [...prev, nextModal]);
      }, NEXT_MODAL_DELAY);
    }
  }, [modalStack, modalQueue]);

  const renderContent = useCallback(
    (modalItem: ModalStackItem) => {
      const { content, opts } = modalItem;
      const EnhancedContent = React.cloneElement(content as React.ReactElement, {
        closeModal: hideModal,
        openModal,
      });

      return opts.lazy ? (
        <Suspense fallback={<Spin size="large" />}>{EnhancedContent}</Suspense>
      ) : (
        EnhancedContent
      );
    },
    [hideModal, openModal]
  );

  const modalContextValue = useMemo(
    () => ({ openModal, hideModal, modalStack }),
    [openModal, hideModal, modalStack]
  );

  return (
    <ModalContext.Provider value={modalContextValue}>
      {children}
      {modalStack.map((modalItem, index) => (
        <Modal
          key={index}
          open={true}
          onCancel={modalItem.opts.onClose || hideModal}
          bodyStyle={modalItem.opts.fullScreen ? { height: "80vh" } : {}}
          {...modalItem.opts}
          keyboard={modalItem.opts.keyboardClosable ?? true}
          maskClosable={modalItem.opts.closable ?? true}
          footer={
            modalItem.opts.footer ? modalItem.opts.footer(hideModal) : null
          }
        >
          {renderContent(modalItem)}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
};
