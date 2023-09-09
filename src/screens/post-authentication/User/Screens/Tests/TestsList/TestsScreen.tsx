import { Button, Typography } from 'antd'

import ActionModal from '@Components/ActionModal'
import CreateTest from './CreateTest'
import { Enum } from '@adewaskar/lms-common'
import Header from '@Components/Header'
// import PastTest from './PastTest'
import Tabs from '@Components/Tabs'
import TestsList from './TestsList'
// import UpcomingTest from './UpcomingTest'
import { useNavigate } from 'react-router'

const { Text } = Typography

const TestsScreen = () => {
  const navigate = useNavigate()
  const CreateCourseCta = (
    <ActionModal cta={<Button type="primary">Create Test</Button>}>
      <CreateTest />
    </ActionModal>
  )
  return (
    <Header title="Tests" extra={[CreateCourseCta]}>
      {/* <Card> */}
      <Tabs navigateWithHash
        // defaultActiveKey="1"
        items={[
          {
            key: 'upcoming',
            label: `Upcoming`,
            children: (
              <TestsList
                filter={{
                  status: [
                    Enum.TestStatus.DRAFT,
                    Enum.TestStatus.PUBLISHED,
                    Enum.TestStatus.IN_PROGRESS
                  ]
                }}
              />
            )
          },
          {
            key: 'past',
            label: `Past`,
            children: (
              <TestsList filter={{ status: [Enum.TestStatus.ENDED] }} />
            )
          }
        ]}
      />
    </Header>
  )
}

export default TestsScreen
