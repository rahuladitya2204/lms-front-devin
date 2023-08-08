import { Button, Typography } from 'antd'

import Tabs from '@Components/Tabs'
import { useNavigate } from 'react-router'
import UpcomingLiveSession from './UpcomingLiveSessions'
import PastLiveSession from './PastLiveSessions'


const LiveSessionsScreen = () => {
  const navigate = useNavigate()

  return (
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
  )
}

export default LiveSessionsScreen
