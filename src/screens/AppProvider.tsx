import { ConfigProvider, message } from 'antd'
import { Learner, User } from '@adewaskar/lms-common'
import useMessage, { MessageContext } from '@Hooks/useMessage'

import { ModalProvider } from '@Components/ActionModal/ModalContext'
import ThemeProvider from './ThemeProvider'

function AppProvider(props: any) {
  const [messageApi, context] = message.useMessage()
  return (
    <MessageContext.Provider value={messageApi}>
      <ModalProvider>
        {context}
        {props.children}
      </ModalProvider>
    </MessageContext.Provider>
  )
}

export default AppProvider
