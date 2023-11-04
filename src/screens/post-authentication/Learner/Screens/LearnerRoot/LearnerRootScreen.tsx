import { FloatButton, Layout, Typography } from 'antd'
import { Store, Utils } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal'
import AppProvider from 'screens/AppProvider'
import CreateTicket from '../Tickets/CreateTicket'
import { CustomerServiceOutlined } from '@ant-design/icons'
import LearnerHeader from './LearnerHeader'
import ThemeProvider from 'screens/ThemeProvider'
import useBreakpoint from '@Hooks/useBreakpoint'
import { useEffect } from 'react'
import { useParams } from 'react-router'
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

  // useEffect(
  //   () => {
  //     if (!isSignedIn) {
  //       navigate('../app/store')
  //     }
  //   },
  //   [isSignedIn]
  // )

  const { isMobile } = useBreakpoint()

  return (
    <ThemeProvider type="learner">
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
        <Layout className="site-layout">
          <LearnerHeader />
        </Layout>
      </AppProvider>
    </ThemeProvider>
  )
}

export default LearnerRootScreen
