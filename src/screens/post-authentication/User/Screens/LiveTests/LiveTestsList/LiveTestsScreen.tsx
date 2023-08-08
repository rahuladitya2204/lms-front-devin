import { Button, Typography } from 'antd'

import Header from '@Components/Header'
// import PastLiveTest from './PastLiveTest'
import Tabs from '@Components/Tabs'
// import UpcomingLiveTest from './UpcomingLiveTest'
import { useNavigate } from 'react-router'
import LiveTestsList from './LiveTestsList'

const { Text } = Typography

const LiveTestsScreen = () => {
  const navigate = useNavigate()

  return (
    <Header
      title="Live Tests"
      extra={[
        <Button type="primary" onClick={() => navigate(`create`)}>
          Create Live Test
        </Button>
      ]}
    >
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
