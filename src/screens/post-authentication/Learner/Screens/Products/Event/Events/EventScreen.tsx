import PastEvent from './PastEvents'
import Tabs from '@Components/Tabs'
import UpcomingEvent from './UpcomingEvents'
import { useNavigate } from 'react-router'

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
