import { Button, Typography } from 'antd'

import Header from '@Components/Header'
import PastLiveSession from './PastLiveSession'
import Tabs from '@Components/Tabs'
import UpcomingLiveSession from './UpcomingLiveSession'
import { useNavigate } from 'react-router'

const { Text } = Typography

const LiveSessionsScreen = () => {
  const navigate = useNavigate()

  return (
    <Header
      title="Live Session"
      extra={[
        <Button type="primary" onClick={() => navigate(`create`)}>
          Create New Session
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
            children: <UpcomingLiveSession filter={{ status: 'created' }} />
          },
          {
            key: 'past',
            label: `Past`,
            children: <PastLiveSession filter={{ status: 'ended' }} />
          }
        ]}
      />
    </Header>
  )
}

export default LiveSessionsScreen
