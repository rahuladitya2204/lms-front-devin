import { ConfigProvider, message, theme } from 'antd'
import { Enum, Store } from '@adewaskar/lms-common'
import useMessage, { MessageContext } from '@Hooks/useMessage'

import LoadingScreen from '@Components/LoadingScreen'
import useDynamicFont from '@Hooks/useDynamicFont'
import { useMemo } from 'react'

const { darkAlgorithm } = theme
function ThemeProvider(props: any) {
  const { branding } = Store.useGlobal(s => s.organisation)
  // console.log(branding, 'branding')
  const { isLoading } = useDynamicFont({
    fontName: branding?.font?.name,
    fontUrl: branding?.font?.url
  })
  const [messageApi, context] = message.useMessage()
  const algorithm = useMemo(
    () => {
      const themes = []
      if (branding.theme === Enum.THEMES.DARK) {
        themes.push(darkAlgorithm)
      }
      return themes
    },
    [branding.theme]
  )

  if (isLoading || props.showLoadingScreen) {
    return <LoadingScreen />
  }

  return (
    // @ts-ignore
    <MessageContext.Provider value={messageApi}>
      {context}
      <ConfigProvider
        theme={{
          algorithm: algorithm,
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
