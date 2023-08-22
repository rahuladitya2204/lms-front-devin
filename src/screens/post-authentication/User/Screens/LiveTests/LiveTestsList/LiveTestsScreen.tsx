import { Button, Typography } from 'antd'

import ActionModal from '@Components/ActionModal'
import CreateLiveTest from './CreateLiveTest'
import { Enum } from '@adewaskar/lms-common'
import Header from '@Components/Header'
import LiveTestsList from './LiveTestsList'
// import PastLiveTest from './PastLiveTest'
import Tabs from '@Components/Tabs'
// import UpcomingLiveTest from './UpcomingLiveTest'
import { useNavigate } from 'react-router'

const { Text } = Typography

const LiveTestsScreen = () => {
  const navigate = useNavigate()
  const CreateCourseCta = (
    <ActionModal cta={<Button type="primary">Create Live Test</Button>}>
      <CreateLiveTest />
    </ActionModal>
  )
  return (
    <Header title="Live Tests" extra={[CreateCourseCta]}>
      {/* <Card> */}
      <Tabs
        // defaultActiveKey="1"
        items={[
          {
            key: 'upcoming',
            label: `Upcoming`,
            children: <LiveTestsList filter={{ status: Enum.LiveTestStatus.PUBLISHED }} />
          },
          {
            key: 'past',
            label: `Past`,
            children: <LiveTestsList filter={{ status: Enum.LiveTestStatus.ENDED }} />
          }
        ]}
      />
    </Header>
  )
}

export default LiveTestsScreen
