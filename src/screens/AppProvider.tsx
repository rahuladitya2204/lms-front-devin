import { ConfigProvider, message } from 'antd'
import { Learner, User } from '@adewaskar/lms-common'
import useMessage, { MessageContext } from '@Hooks/useMessage'

import ThemeProvider from './ThemeProvider'

function AppProvider(props: any) {
  const [messageApi, context] = message.useMessage()
  return (
    <MessageContext.Provider value={messageApi}>
      {context}
      {props.children}
    </MessageContext.Provider>
  )
}

export default AppProvider
