import { Button, Card, Typography } from 'antd'

import PastEvent from './PastTests'
import PastTest from './PastTests'
import Tabs from '@Components/Tabs'
import UpcomingEvent from './UpcomingTests'
import UpcomingTest from './UpcomingTests'
import { useNavigate } from 'react-router'

const EventsScreen = () => {
  const navigate = useNavigate()

  return (
    <Card bodyStyle={{ paddingTop: 0 }}>
      <Tabs
        navigateWithHash
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
    </Card>
  )
}

export default EventsScreen
