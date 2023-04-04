import { createContext, useContext } from 'react'

import { MessageInstance } from 'antd/es/message/interface'

const useMessage = () => {
  const Message = useContext(MessageContext)
  return Message
}

export default useMessage

export const MessageContext = createContext({
  open: (data: { type: string, content: string }) => {}
})
