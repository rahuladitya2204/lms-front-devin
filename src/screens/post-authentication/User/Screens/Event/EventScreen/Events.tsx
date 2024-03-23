import { Enum, User } from '@adewaskar/lms-common'

import { Button } from 'antd'
import Calendar from '@Components/Calendar/Calendar'
import Header from '@User/Screens/UserRoot/UserHeader'
import PastEvent from './PastEvent'
import Tabs from '@Components/Tabs'
import UpcomingEvent from './UpcomingEvent'
import { useNavigate } from 'react-router'

const EventsScreen = () => {
  const navigate = useNavigate()
  const { data: events } = User.Queries.useGetEvents()
  return (
    <Header
      title="Event"
      extra={[
        <Button type="primary" onClick={() => navigate(`create`)}>
          Create New Event
        </Button>
      ]}
    >
      <Tabs
        items={[
          {
            key: 'upcoming',
            label: `Upcoming`,
            children: (
              <UpcomingEvent
                filter={{
                  // @ts-ignore
                  status: [Enum.EventStatus.DRAFT, Enum.EventStatus.PUBLISHED]
                }}
              />
            )
          },
          {
            key: 'past',
            label: `Past`,
            children: <PastEvent filter={{ status: 'ended' }} />
          }
        ]}
      />
      {/* <Row>
        <Col span={2} />
        <Col span={20}>
          <Calendar
            onDayClick={e => {
              console.log(e, 'c')
            }}
            events={events}
          />
        </Col>
        <Col span={2} />
      </Row> */}
    </Header>
  )
}

export default EventsScreen
