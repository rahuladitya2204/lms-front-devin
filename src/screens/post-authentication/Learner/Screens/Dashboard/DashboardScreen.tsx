import { CommentOutlined, CustomerServiceOutlined } from '@ant-design/icons'
// @ts-nocheck
import { FloatButton, Layout, Typography } from 'antd'

import ActionModal from '@Components/ActionModal'
import AppProvider from 'screens/AppProvider'
import CreateTicket from '../Tickets/CreateTicket'
import DashboardHeader from './DashboardHeader'
import ThemeProvider from 'screens/ThemeProvider'

const { Title } = Typography
const LearnerDashboard: React.FC = () => {
  return (
    <ThemeProvider type="learner">
      <AppProvider>
        <ActionModal
          title={
            <Title style={{ marginTop: 0 }} level={3}>
              Raise a ticket
            </Title>
          }
          cta={
            <FloatButton
              shape="circle"
              type="primary"
              icon={<CustomerServiceOutlined />}
            />
          }
        >
          <CreateTicket />
        </ActionModal>
        <Layout>
          <Layout className="site-layout">
            <DashboardHeader />
          </Layout>
        </Layout>
      </AppProvider>
    </ThemeProvider>
  )
}

export default LearnerDashboard
