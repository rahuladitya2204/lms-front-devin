import { Common, Constants, Enum, Store } from '@adewaskar/lms-common'
import { ConfigProvider, message, theme } from 'antd'
import useMessage, { MessageContext } from '@Hooks/useMessage'

import ApplyFavicon from '@Learner/Screens/LearnerRoot/ApplyFavicon'
import Banner from '@Components/Banner'
import LoadingScreen from '@Components/LoadingScreen'
import useDynamicFont from '@Hooks/useDynamicFont'
import { useMemo } from 'react'

const { darkAlgorithm } = theme
function ThemeProvider(props: any) {
  const { data: organisation } = Common.Queries.useGetOrgDetails()
  // @ts-ignore
  const { branding, shortName } =
    organisation || Constants.INITIAL_ORG_SETTING_DETAILS.branding
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
    [branding?.theme]
  )

  // if (isLoading || props.showLoadingScreen) {
  //   return <LoadingScreen />
  // }

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
      <ApplyFavicon shortName={shortName} faviconUrl={branding.favIcon.url} />
      <Banner />
    </MessageContext.Provider>
  )
}

export default ThemeProvider
