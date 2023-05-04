import { ConfigProvider, message } from 'antd'
import { Learner, User } from '@adewaskar/lms-common'
import useMessage, { MessageContext } from '@Hooks/useMessage'

import { UserTheme } from './themes/UserTheme'
import { useParams } from 'react-router'

function ThemeProvider(props: any) {
  const [messageApi, context] = message.useMessage()
  const { data: appDetails } = Learner.Queries.useGetAppDetails()
  return (
    // @ts-ignore
    <MessageContext.Provider value={messageApi}>
      {context}
      <ConfigProvider
        theme={{
          token:
            props.type === 'learner'
              ? {
                  colorPrimary: appDetails.branding.primaryColor
                }
              : UserTheme
        }}
        csp={{ nonce: 'YourNonceCode' }}
      >
        {props.children}
      </ConfigProvider>
    </MessageContext.Provider>
  )
}

export default ThemeProvider
