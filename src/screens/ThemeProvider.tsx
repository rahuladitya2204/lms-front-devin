import { ConfigProvider, message } from 'antd'
import { Constants, Learner, Store, User } from '@adewaskar/lms-common'
import useMessage, { MessageContext } from '@Hooks/useMessage'

import { UserTheme } from './themes/UserTheme'
import { darkAlgorithm } from '@ant-design/compatible'
import useDynamicFont from '@Hooks/useDynamicFont'

function ThemeProvider(props: any) {
  const { branding } = Store.useGlobal(s => s.organisation)
  console.log(branding, 'branding')

  const { isLoading } = useDynamicFont({
    fontName: branding.font.name,
    fontUrl: branding.font.url
  })
  const [messageApi, context] = message.useMessage()
  // const branding =
  //   props.branding || Constants.INITIAL_ORG_SETTING_DETAILS.branding;
  return (
    // @ts-ignore
    <MessageContext.Provider value={messageApi}>
      {context}
      <ConfigProvider
        theme={{
          algorithm: [darkAlgorithm],
          token: {
            colorPrimary: branding.colors.primary,
            fontFamily: branding.font.name
            // algorithm: true
          }
        }}
        csp={{ nonce: 'YourNonceCode' }}
      >
        {props.children}
      </ConfigProvider>
    </MessageContext.Provider>
  )
}

export default ThemeProvider
