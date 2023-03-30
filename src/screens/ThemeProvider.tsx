import { ConfigProvider } from 'antd'
import { Learner } from '@adewaskar/lms-common'

function ThemeProvider(props: any) {
  // const { data: appDetails } = Learner.Queries.useGetAppDetails()
  return (
    <ConfigProvider
      theme={{
        token: {
          // colorPrimary: appDetails.branding.primaryColor
        }
      }}
      csp={{ nonce: 'YourNonceCode' }}
    >
      {props.children}
    </ConfigProvider>
  )
}

export default ThemeProvider
