import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react';

import { Modal } from 'antd';

interface ModalContextType {
  openModal: (content: ReactNode,opts?:ActionModalPropsI) => void;
  hideModal: () => void;
  modalContent: ReactNode | null;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

interface ActionModalPropsI {
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


export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [opts, setOpts] = useState<ActionModalPropsI>({});

  const openModal = useCallback((content: ReactNode,opts?:ActionModalPropsI) => {
    setModalContent(content);
    setIsModalVisible(true);
    // @ts-ignore
    setOpts(opts)
  }, []);

  const hideModal = useCallback(() => {
    setIsModalVisible(false);
    setModalContent(null);
  }, []);
  // @ts-ignore
  const childrenWithCloseModal = modalContent ? React.cloneElement(modalContent, {
    closeModal: hideModal
  }) : modalContent;
  return (
    <ModalContext.Provider value={{ openModal, hideModal, modalContent }}>
      {children}
      {/* @ts-ignore */}
      <Modal
        open={isModalVisible}
        onCancel={hideModal}
        // footer={null}
        {...opts}
      >
        {childrenWithCloseModal}
      </Modal>
    </ModalContext.Provider>
  );
};
