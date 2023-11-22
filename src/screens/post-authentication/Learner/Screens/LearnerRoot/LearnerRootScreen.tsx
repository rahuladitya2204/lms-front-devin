import { Alert, Button, FloatButton, Layout, Typography } from 'antd'
import { Enum, Learner, Store, Utils } from '@adewaskar/lms-common'
import { Fragment, useEffect, useMemo } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { useOutletContext, useParams } from 'react-router'

import ActionModal from '@Components/ActionModal/ActionModal'
import AppProvider from 'screens/AppProvider'
import ApplyFavicon from './ApplyFavicon'
import CreateTicket from '../Tickets/CreateTicket'
import { CustomerServiceOutlined } from '@ant-design/icons'
import LearnerFooter from './LearnerFooter'
import LearnerHeader from './LearnerHeader'
import LearnerProfile from '../Account/CompleteProfile'
import LoadingScreen from '@Components/LoadingScreen'
import ThemeProvider from 'screens/ThemeProvider'
import useBreakpoint from '@Hooks/useBreakpoint'
import useDynamicFont from '@Hooks/useDynamicFont'
import { useGetNodeFromRouterOutlet } from '@Hooks/CommonHooks'

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

  useEffect(
    () => {
      if (orgId) {
        Utils.Storage.SetItem('orgId', orgId + '')
      }
    },
    [orgId]
  )
  const { isMobile } = useBreakpoint()
  const { showLoadingScreen } = useOutletContext<any>();
  const isSignedIn = Store.useAuthentication(s => s.isSignedIn);
  const {data: learner } = Learner.Queries.useGetLearnerDetails();
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
        <Layout style={{ minHeight: '100vh', paddingBottom: 50 }}>
          {((!isMobile)&&isSignedIn)?<Fragment>
            {(learner.profile.status === Enum.LearnerProfileStatus.INCOMPLETE || learner.profile.status === Enum.LearnerProfileStatus.PARTIAL_COMPLETE) ?
              <Alert action={<ActionModal height={600} width={300} title='Complete your profile' cta={<Button size='small' >Complete Profile</Button>}>
                <LearnerProfile/>
              </ActionModal>}
      message="Your profile is incomplete please fill details"
      banner type='error'
      closable
    />:null}
         </Fragment>:null}
          <LearnerHeader />
          {/* <LearnerFooter/> */}
 </Layout>
      </AppProvider>
    </ThemeProvider>
  )
}

export default LearnerRootScreen
