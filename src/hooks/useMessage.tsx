import { createContext, useContext } from 'react'

import { ArgsProps } from 'antd/es/message'
import { MessageType } from 'antd/es/message/interface'
import { ParticlesContext } from '@Components/Particles/ParticleProvider'

const useMessage = () => {
  const Message = useContext(MessageContext)
  // @ts-ignore
  const { initiateEffect } = useContext(ParticlesContext)
  return {
    open: (args: MessagePropsI) => {
      Message.open(args)
      if (args?.particle) {
        let effect = args?.particle
        if (effect === true) {
          effect = 'confetti'
        }
        // @ts-ignore
        if (!effect) {
          return
        }
        initiateEffect(effect)
      }
    }
  }
}

export default useMessage

interface MessagePropsI extends ArgsProps {
  particle?: boolean | string;
}

export const MessageContext = createContext({
  open: (args: MessagePropsI): MessageType | void => {}
})
