import { Button, Typography } from 'antd'

import Header from '@Components/Header'
// import PastLiveTest from './PastLiveTest'
import Tabs from '@Components/Tabs'
// import UpcomingLiveTest from './UpcomingLiveTest'
import { useNavigate } from 'react-router'
import LiveTestsList from './LiveTestsList'
import ActionModal from '@Components/ActionModal'
import CreateLiveTest from './CreateLiveTest'

const { Text } = Typography

const LiveTestsScreen = () => {
  const navigate = useNavigate()
  const CreateCourseCta = (
    <ActionModal cta={<Button type="primary">Create Course</Button>}>
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
            children: <LiveTestsList filter={{ status: 'created' }} />
          },
          {
            key: 'past',
            label: `Past`,
            children: <LiveTestsList filter={{ status: 'ended' }} />
          }
        ]}
      />
    </Header>
  )
}

export default LiveTestsScreen
