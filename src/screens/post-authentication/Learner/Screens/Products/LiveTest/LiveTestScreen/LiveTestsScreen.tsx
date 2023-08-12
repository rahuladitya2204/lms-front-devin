import { Button, Typography } from 'antd'

import PastLiveSession from './PastLiveTests'
import Tabs from '@Components/Tabs'
import UpcomingLiveSession from './UpcomingLiveTests'
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
