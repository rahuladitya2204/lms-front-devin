import { Button, Col, Row, Typography } from 'antd'

import Header from '@User/Screens/UserRoot/UserHeader'
import PastEvent from './PastEvent'
import Tabs from '@Components/Tabs'
import UpcomingEvent from './UpcomingEvent'
import { useNavigate } from 'react-router'
import Calendar from '@Components/Calendar/Calendar'
import { User } from '@adewaskar/lms-common'

const { Text } = Typography

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
            children: <UpcomingEvent filter={{ status: 'created' }} />
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
