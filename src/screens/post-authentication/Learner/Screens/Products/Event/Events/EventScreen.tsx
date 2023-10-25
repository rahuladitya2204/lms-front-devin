import { Button, Typography } from 'antd'

import Tabs from '@Components/Tabs'
import { useNavigate } from 'react-router'
import UpcomingEvent from './UpcomingEvents'
import PastEvent from './PastEvents'


const EventsScreen = () => {
  const navigate = useNavigate()

  return (
    <Tabs
      // defaultActiveKey="1"
      items={[
        {
          key: 'upcoming',
          label: `Upcoming`,
          children: <UpcomingEvent filter={{ status: 'created' }} />
        },
        {
          key: 'past',
          label: `Past`,
          children: <PastEvent filter={{ status: 'ended' }} />
        }
      ]}
    />
  )
}

export default EventsScreen
