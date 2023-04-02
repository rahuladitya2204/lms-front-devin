import { Learner, User } from '@adewaskar/lms-common'

import { ConfigProvider } from 'antd'

function ThemeProvider(props: any) {
  const { data: appDetails } =
    props.type === 'learner'
      ? Learner.Queries.useGetAppDetails()
      : User.Queries.useGetAppDetails()
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: appDetails.branding.primaryColor
        }
      }}
      csp={{ nonce: 'YourNonceCode' }}
    >
      {props.children}
    </ConfigProvider>
  )
}

export default ThemeProvider
