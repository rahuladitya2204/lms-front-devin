import { Button, Typography } from 'antd'

import PastLiveSession from './PastTests'
import PastTest from './PastTests'
import Tabs from '@Components/Tabs'
import UpcomingLiveSession from './UpcomingTests'
import UpcomingTest from './UpcomingTests'
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
          children: <UpcomingTest filter={{ status: ['created'] }} />
        },
        {
          key: 'past',
          label: `Past`,
          children: <PastTest filter={{ status: ['ended'] }} />
        }
      ]}
    />
  )
}

export default LiveSessionsScreen
