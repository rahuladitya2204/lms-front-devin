import { CommentOutlined, CustomerServiceOutlined } from '@ant-design/icons'
// @ts-nocheck
import { FloatButton, Layout, Typography } from 'antd'
import { Store, Utils } from '@adewaskar/lms-common'
import { useNavigate, useParams } from 'react-router'

import ActionModal from '@Components/ActionModal'
import AppProvider from 'screens/AppProvider'
import CreateTicket from '../Tickets/CreateTicket'
import LearnerHeader from './LearnerHeader'
import ThemeProvider from 'screens/ThemeProvider'
import { useEffect } from 'react'
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

  return (
    <ThemeProvider type="learner">
      <AppProvider>
        {isSignedIn ? (
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
        ) : null}
        <Layout>
          <Layout className="site-layout">
            <LearnerHeader />
          </Layout>
        </Layout>
      </AppProvider>
    </ThemeProvider>
  )
}

export default LearnerRootScreen
