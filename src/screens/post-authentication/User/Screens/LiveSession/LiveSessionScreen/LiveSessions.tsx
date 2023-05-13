import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Typography
} from 'antd'

import Header from '@Components/Header'
import PastLiveSession from './PastLiveSession'
import { Types } from '@adewaskar/lms-common'
import UpcomingLiveSession from './UpcomingLiveSession'
import { User } from '@adewaskar/lms-common'
import { VideoCameraOutlined } from '@ant-design/icons'
import ViewRecording from '../RecordingPlayer'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Text } = Typography

const LiveSessionsScreen = () => {
  const navigate = useNavigate()

  return (
    <Header
      title="Live Session"
      extra={[
        <Button type="primary" onClick={() => navigate(`create`)}>
          Create New Session
        </Button>
      ]}
    >
      {/* <Card> */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Upcoming" key="1">
          <UpcomingLiveSession filter={{ status: 'created' }} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Past" key="2">
          <PastLiveSession filter={{ status: 'ended' }} />
        </Tabs.TabPane>
      </Tabs>
      {/* </Card> */}
    </Header>
  )
}

export default LiveSessionsScreen
