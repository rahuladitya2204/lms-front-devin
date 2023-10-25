import { Button, Typography } from 'antd'

import Header from '@User/Screens/UserRoot/UserHeader'
import PastEvent from './PastEvent'
import Tabs from '@Components/Tabs'
import UpcomingEvent from './UpcomingEvent'
import { useNavigate } from 'react-router'

const { Text } = Typography

const EventsScreen = () => {
  const navigate = useNavigate()

  return (
    <Header
      title="Event"
      extra={[
        <Button type="primary" onClick={() => navigate(`create`)}>
          Create New Event
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
            children: <UpcomingEvent filter={{ status: 'created' }} />
          },
          {
            key: 'past',
            label: `Past`,
            children: <PastEvent filter={{ status: 'ended' }} />
          }
        ]}
      />
    </Header>
  )
}

export default EventsScreen
