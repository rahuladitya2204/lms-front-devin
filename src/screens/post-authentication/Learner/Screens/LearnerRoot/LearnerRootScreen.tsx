"use client";
import { Alert, Button, FloatButton } from 'antd'
import { Enum, Learner, Store, Utils } from '@adewaskar/lms-common'
import { Fragment, useEffect } from 'react'
import { useOutletContext, useParams } from 'react-router'
import { useSearchParams } from 'next/navigation';
import ActionModal from '@Components/ActionModal/ActionModal'
import AppProvider from 'screens/AppProvider'
import CreateTicket from '../Tickets/CreateTicket'
import { CustomerServiceOutlined } from '@ant-design/icons'
import Layout from '@Components/Layout'
import LearnerFooter from './LearnerFooter'
import LearnerHeader from './LearnerHeader'
import LearnerProfile from '../Account/LearnerProfile'
import ThemeProvider from 'screens/ThemeProvider'
import { Typography } from '@Components/Typography'
import { useBlockBackButton } from '@User/Screens/Event/LiveSessionPlayer/User/hooks'
import useServerBreakpoint from '@ServerHooks/useServerBreakpoint'
import useServerAuth from '@ServerHooks/useServerAuth';

const { Title } = Typography;

export interface LearnerRootScreenProps {
  children?: React.ReactNode;
}

const LearnerRootScreen = ({children}: LearnerRootScreenProps) => {
  useBlockBackButton()

  const { orgId } = useParams()
  const searchParams = useSearchParams()
  const userAuthToken = searchParams.get('userAuthToken')
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
  const { isMobile } = useServerBreakpoint()
  const outletcontext = useOutletContext<any>();
  const isSignedIn = useServerAuth(s => s.isSignedIn);
  const {data: learner } = Learner.Queries.useGetLearnerDetails();
  return (
    <ThemeProvider showLoadingScreen={outletcontext?.showLoadingScreen} type="learner">
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
              Create Ticket (TODO Update)
              {/* <CreateTicket /> */}
            </ActionModal>
          ) : null
        ) : null}
        <Layout style={{paddingBottom: 0,display:'flex'}}>
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
          <div style={{flex:1,paddingBottom:50}}>
          <LearnerHeader children={children} />
         </div>
          <LearnerFooter/>
 </Layout>
      </AppProvider>
    </ThemeProvider>
  )
}

export default LearnerRootScreen
