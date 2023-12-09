import { Button, Card, Typography } from 'antd'

import { Enum } from '@adewaskar/lms-common'
import PastEvent from './PastTests'
import PastTest from './PastTests'
import Tabs from '@Components/Tabs'
import UpcomingEvent from './UpcomingTests'
import UpcomingTest from './UpcomingTests'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

const EventsScreen = () => {
  const navigate = useNavigate()
  // const [params, setParams] = useSearchParams();
  return (
    <Card bodyStyle={{ paddingTop: 0 }}>
      <Tabs
        navigateWithHash
        items={[
          {
            key: 'upcoming',
            label: `Upcoming`,
            children: (
              <UpcomingTest
                filter={{
                  status: [Enum.TestStatus.DRAFT, Enum.TestStatus.PUBLISHED]
                }}
              />
            )
          },
          {
            key: 'past',
            label: `Past`,
            children: <PastTest filter={{ status: [Enum.TestStatus.ENDED] }} />
          }
        ]}
      />
    </Card>
  )
}

export default EventsScreen
