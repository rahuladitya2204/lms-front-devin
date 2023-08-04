import { Button, Typography } from 'antd'

import Header from '@Components/Header'
// import PastLiveTest from './PastLiveTest'
import Tabs from '@Components/Tabs'
// import UpcomingLiveTest from './UpcomingLiveTest'
import { useNavigate } from 'react-router'
import UpcomingLiveTest from './UpcomingLiveTests'
import PastLiveTests from './PastLiveTests'

const { Text } = Typography

const LiveTestsScreen = () => {
  const navigate = useNavigate()

  return (
    <Header
      title="Live Tests"
      extra={[
        <Button type="primary" onClick={() => navigate(`create`)}>
          Create Live Test
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
            children: <UpcomingLiveTest filter={{ status: 'created' }} />
          },
          {
            key: 'past',
            label: `Past`,
            children: <PastLiveTests filter={{ status: 'ended' }} />
          }
        ]}
      />
    </Header>
  )
}

export default LiveTestsScreen
