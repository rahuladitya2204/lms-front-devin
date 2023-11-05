import { ConfigProvider, message, theme } from 'antd'
import useMessage, { MessageContext } from '@Hooks/useMessage'

import { Store } from '@adewaskar/lms-common'
import useDynamicFont from '@Hooks/useDynamicFont'

function ThemeProvider(props: any) {
  const { branding } = Store.useGlobal(s => s.organisation)
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
          algorithm: [
            theme.darkAlgorithm
            // theme.compactAlgorithm
          ],
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
