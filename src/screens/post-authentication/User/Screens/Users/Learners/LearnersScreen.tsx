import { Button, Card, Col, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import AddLearner from './AddLearners'
import Header from '@Components/Header'
import LearnersTable from './LearnersTable'
import ThemeProvider from 'screens/ThemeProvider'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import Container from '@Components/Container'

function LearnersScreen () {
  const { data, isLoading: loading } = User.Queries.useGetLearners()

  return (
    <Header
      title={'Learners'}
      extra={[
        <ActionModal cta={<Button type="primary">Add Learner</Button>}>
          <AddLearner> </AddLearner>
        </ActionModal>
      ]}
    >
      <Container>
        <Row>
          <Col span={24}>
            <LearnersTable />
          </Col>
        </Row>
      </Container>
    </Header>
  )
}

export default LearnersScreen
