import { CommentOutlined, CustomerServiceOutlined } from '@ant-design/icons'
// @ts-nocheck
import { FloatButton, Layout, Typography } from 'antd'

import ActionModal from '@Components/ActionModal'
import AppProvider from 'screens/AppProvider'
import CreateTicket from '../Tickets/CreateTicket'
import LearnerHeader from './LearnerHeader'
import ThemeProvider from 'screens/ThemeProvider'
import { Utils } from '@adewaskar/lms-common'
import { useEffect } from 'react'
import { useParams } from 'react-router'

const { Title } = Typography
const LearnerRootScreen: React.FC = () => {
  const { orgId } = useParams()

  useEffect(
    () => {
      if (orgId) {
        Utils.Storage.SetItem('orgId', orgId + '')
      }
    },
    [orgId]
  );
  
  return (
    <ThemeProvider type="learner">
      <AppProvider>
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
