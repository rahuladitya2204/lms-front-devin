import { Alert, Button, FloatButton } from 'antd'
import { Enum, Learner, Store, Utils } from '@invinciblezealorg/lms-common'
import { Fragment, useEffect, useMemo } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { useOutletContext, useParams } from 'react-router'

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
import styled from '@emotion/styled'
import { useBlockBackButton } from '@User/Screens/Event/LiveSessionPlayer/User/hooks'
import useBreakpoint from '@Hooks/useBreakpoint'

const { Title } = Typography;

const CustomLayout = styled(Layout)`
.ant-layout>div {
  display: block;
  width:auto;
}
`

const LearnerRootScreen: React.FC = () => {
  useBlockBackButton()

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
          <LearnerHeader />
         </div>
          <LearnerFooter/>
 </Layout>
      </AppProvider>
    </ThemeProvider>
  )
}

export default LearnerRootScreen
