import { Button, Card, Col, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddLearner from './AddLearners'
import Container from '@Components/Container'
import Header from '@User/Screens/UserRoot/UserHeader'
import LearnersTable from './LearnersTable'
import ThemeProvider from 'screens/ThemeProvider'
import { Types } from '@invinciblezealorg/lms-common'
import { User } from '@invinciblezealorg/lms-common'
import dayjs from 'dayjs'
import { useModal } from '@Components/ActionModal/ModalContext'

function LearnersScreen () {
  const { data: learners, isFetching: loading } = User.Queries.useGetLearners()
  const { openModal } = useModal()
  return (
    <Header
      title={learners.length ? `Learners(${learners.length})` : 'Learners'}
      extra={[
        <Button
          onClick={() => {
            openModal(<AddLearner> </AddLearner>)
          }}
          type="primary"
        >
          Add Learner
        </Button>
        // <ActionModal cta={<Button type="primary">Add Learner</Button>}>
        //   <AddLearner> </AddLearner>
        // </ActionModal>
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
