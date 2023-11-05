import { ConfigProvider, message } from 'antd'
import { Constants, Learner, Store, User } from '@adewaskar/lms-common'
import useMessage, { MessageContext } from '@Hooks/useMessage'

import LoadingScreen from '@Components/LoadingScreen'
import { UserTheme } from './themes/UserTheme'
import useDynamicFont from '@Hooks/useDynamicFont'
import { useParams } from 'react-router'

function ThemeProvider(props: any) {
  const [messageApi, context] = message.useMessage()
  // const { data: appDetails } = Learner.Queries.useGetAppDetails()
  const organisation = Store.useGlobal(s => s.organisation)
  // console.log(organisation, 'organisation')
  const branding =
    // @ts-ignore
    organisation.branding || { colors: { primary: 'blue' } }
  // @ts-ignore
  // const { isLoading } = useDynamicFont({
  //   fontName: branding.font.name,
  //   fontUrl: branding.font.url
  // })
  // if (isLoading) {
  //   return <LoadingScreen />
  // }
  return (
    // @ts-ignore
    <MessageContext.Provider value={messageApi}>
      {context}
      <ConfigProvider
        theme={{
          token:
            props.type === 'learner'
              ? {
                  colorPrimary: branding.colors.primary,
                  fontFamily: branding.font.name
                  // algorithm: true
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
