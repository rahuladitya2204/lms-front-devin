import { Button, Typography } from 'antd'

import PastLiveSession from './PastLiveTests'
import PastLiveTest from './PastLiveTests'
import Tabs from '@Components/Tabs'
import UpcomingLiveSession from './UpcomingLiveTests'
import UpcomingLiveTest from './UpcomingLiveTests'
import { useNavigate } from 'react-router'

const LiveSessionsScreen = () => {
  const navigate = useNavigate()

  return (
    <Tabs
      // defaultActiveKey="1"
      items={[
        {
          key: 'upcoming',
          label: `Upcoming`,
          children: <UpcomingLiveTest filter={{ status: ['created'] }} />
        },
        {
          key: 'past',
          label: `Past`,
          children: <PastLiveTest filter={{ status: ['ended'] }} />
        }
      ]}
    />
  )
}

export default LiveSessionsScreen
