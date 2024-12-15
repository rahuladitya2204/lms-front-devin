import { createContext, useContext } from "react";

import { ArgsProps } from "antd/es/message";
import { MessageType } from "antd/es/message/interface";
import { ParticlesContext } from "@Components/Particles/ParticleProvider";
import { message } from "antd";

const useMessage = () => {
  return () => message;
};

export default useMessage;

interface MessagePropsI extends ArgsProps {
  particle?: boolean | string;
}

export const MessageContext = createContext({
  open: (args: MessagePropsI): MessageType | void => { },
});
