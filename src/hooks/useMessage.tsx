import { createContext, useContext } from 'react'

import { ArgsProps } from 'antd/es/message'
import { MessageType } from 'antd/es/message/interface'

const useMessage = () => {
  const Message = useContext(MessageContext)
  return Message
}

export default useMessage

export const MessageContext = createContext({
  open: (args: ArgsProps): MessageType | void => {}
})
