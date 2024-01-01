import { Button, Card, Col, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddInstructor from './AddInstructor'
import Container from '@Components/Container'
import Header from '@User/Screens/UserRoot/UserHeader'
import MoreButton from '@Components/MoreButton'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import { useModal } from '@Components/ActionModal/ModalContext'

function InstructorsScreen() {
  const { data, isFetching: loading } = User.Queries.useGetInstructors()
  const { openModal } = useModal()

  return (
    <Header
      title={'Instructors'}
      extra={[
        <Button
          onClick={() => {
            openModal(<AddInstructor> </AddInstructor>)
          }}
          type="primary"
        >
          Add Instructor
        </Button>
        // <ActionModal cta={<Button type="primary">Add Instructor</Button>}>
        //   <AddInstructor> </AddInstructor>
        // </ActionModal>
      ]}
    >
      <Container>
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading}>
              <Table.Column title="Name" dataIndex="name" key="name" />
              <Table.Column
                title="Email Adress"
                dataIndex="email"
                key="email"
              />
              <Table.Column
                title="Designation"
                dataIndex="designation"
                key="designation"
              />
              {/* <Table.Column
                title="Last Login"
                dataIndex="lastActive"

              /> */}
              <Table.Column title="Courses" dataIndex="courses" key="courses" />
              <Table.Column title="Rating" dataIndex="rating" key="rating" />
              <Table.Column
                title="Joined On"
                dataIndex="createdAt"
                key="createdAt"
                render={(_: any, record: Types.Instructor) => (
                  <Space size="middle">
                    {dayjs(record.createdAt).format('LL')}
                  </Space>
                )}
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Instructor) => (
                  <MoreButton
                    items={[
                      {
                        label: 'Edit Details',
                        onClick: () => {
                          window.open(
                            `instructors/${record._id}/editor`,
                            '_blank'
                          )
                        },
                        key: 'edit',
                        icon: <EditOutlined />
                      },
                      {
                        label: (
                          <span
                            onClick={e => {
                              e.stopPropagation()
                              // DeleteSectionItem(section._id, item._id)
                            }}
                          >
                            Delete Chapter Item
                          </span>
                        ),
                        key: 'delete',
                        icon: <DeleteOutlined />
                      }
                    ]}
                  />
                )}
              />
            </Table>
          </Col>
        </Row>
      </Container>
    </Header>
  )
}

export default InstructorsScreen
