import { FloatButton, Layout, Typography } from 'antd'
import { Learner, Store, Utils } from '@adewaskar/lms-common'
import { useEffect, useMemo } from 'react'
import { useOutletContext, useParams } from 'react-router'

import ActionModal from '@Components/ActionModal/ActionModal'
import AppProvider from 'screens/AppProvider'
import ApplyFavicon from './ApplyFavicon'
import CreateTicket from '../Tickets/CreateTicket'
import { CustomerServiceOutlined } from '@ant-design/icons'
import LearnerFooter from './LearnerFooter'
import LearnerHeader from './LearnerHeader'
import LoadingScreen from '@Components/LoadingScreen'
import ThemeProvider from 'screens/ThemeProvider'
import useBreakpoint from '@Hooks/useBreakpoint'
import useDynamicFont from '@Hooks/useDynamicFont'
import { useGetNodeFromRouterOutlet } from '@Hooks/CommonHooks'
import { useSearchParams } from 'react-router-dom'

const { Title } = Typography
const LearnerRootScreen: React.FC = () => {
  const { orgId } = useParams()
  const [params] = useSearchParams()
  const userAuthToken = params.get('userAuthToken')
  useEffect(
    () => {
      if (userAuthToken) {
        Utils.Storage.SetItem('userType', `learner`)
        Utils.Storage.SetItem('learner-auth-token', userAuthToken)
      }
    },
    [userAuthToken]
  )

  const { isSignedIn } = Store.useAuthentication(s => s)

  useEffect(
    () => {
      if (orgId) {
        Utils.Storage.SetItem('orgId', orgId + '')
      }
    },
    [orgId]
  )
  const { isMobile } = useBreakpoint()
  const { showLoadingScreen } = useOutletContext<any>()
  // if (showLoadingScreen) {
  //   return <LoadingScreen />
  // }
  // return <LoadingScreen />
  return (
    <ThemeProvider showLoadingScreen={showLoadingScreen} type="learner">
      {/* <ApplyFavicon faviconUrl={ brand} /> */}
      <AppProvider>
        {isSignedIn ? (
          !isMobile ? (
            <ActionModal
              width={600}
              title={
                <Title style={{ marginTop: 0 }} level={3}>
                  Raise a ticket
                </Title>
              }
              cta={
                <FloatButton
                  style={{ width: 60, height: 60 }}
                  shape="circle"
                  type="primary"
                  icon={<CustomerServiceOutlined size={5600} />}
                />
              }
            >
              <CreateTicket />
            </ActionModal>
          ) : null
        ) : null}
        <Layout style={{ minHeight: '100vh' ,paddingBottom:50}}>
          <LearnerHeader />
          {/* <LearnerFooter/> */}
 </Layout>
      </AppProvider>
    </ThemeProvider>
  )
}

export default LearnerRootScreen
