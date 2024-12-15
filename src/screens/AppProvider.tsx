import { ConfigProvider, message } from "antd";
import { Learner, User } from "@adewaskar/lms-common";
import useMessage, { MessageContext } from "@Hooks/useMessage";

import { ModalProvider } from "@Components/ActionModal/ModalContext";
import ThemeProvider from "./ThemeProvider";

function AppProvider(props: any) {
  return <ModalProvider>{props.children}</ModalProvider>;
}

export default AppProvider;
