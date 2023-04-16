import { ConfigProvider, message } from 'antd'
import { Learner, User } from '@adewaskar/lms-common'
import useMessage, { MessageContext } from '@Hooks/useMessage'

function AppProvider(props: any) {
  const [messageApi, context] = message.useMessage()
  return (
    // @ts-ignore
    <MessageContext.Provider value={messageApi}>
      {context}
      {props.children}
    </MessageContext.Provider>
  )
}

export default AppProvider
