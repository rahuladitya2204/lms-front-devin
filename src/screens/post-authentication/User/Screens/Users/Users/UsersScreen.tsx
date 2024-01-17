import { Button, Card, Col, Modal, Row, Space } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import Table, { TableColumn } from '@Components/Table/TableComponent'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddUser from './AddUser'
import Container from '@Components/Container'
import Header from '@User/Screens/UserRoot/UserHeader'
import MoreButton from '@Components/MoreButton'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'

const { confirm } = Modal

function UsersScreen() {
  const { data, isFetching: loading } = User.Queries.useGetUsers()
  const { openModal } = useModal()
  const {
    mutate: deleteUser,
    isLoading: deletingUser
  } = User.Queries.useDeleteUser()
  const message = useMessage()
  return (
    <Header
      title={'Users'}
      extra={[
        <Button
          onClick={() => {
            openModal(<AddUser> </AddUser>)
          }}
          type="primary"
        >
          Add User
        </Button>
        // <ActionModal cta={<Button type="primary">Add User</Button>}>
        //   <AddUser> </AddUser>
        // </ActionModal>
      ]}
    >
      <Container>
        <Row>
          <Col span={24}>
            <Table
              searchFields={['name', 'contactNo', 'email']}
              dataSource={data}
              loading={loading || deletingUser}
            >
              <TableColumn title="Name" dataIndex="name" key="name" />
              <TableColumn
                title="Contact No"
                dataIndex="contactNo"
                key="contactNo"
              />
              {/* <TableColumn
                title="Designation"
                dataIndex="designation"
                key="designation"
              /> */}

              {/* <TableColumn title="Courses" dataIndex="courses" key="courses" />
              <TableColumn title="Rating" dataIndex="rating" key="rating" /> */}
              <TableColumn
                title="Joined On"
                dataIndex="createdAt"
                key="createdAt"
                render={(_: any, record: Types.User) => (
                  <Space size="middle">
                    {dayjs(record.createdAt).format('LL')}
                  </Space>
                )}
              />
              <TableColumn
                title="Action"
                key="action"
                render={(_: any, record: Types.User) => (
                  <MoreButton
                    items={[
                      {
                        label: 'Edit User',
                        onClick: () => {
                          window.open(`users/${record._id}/editor`, '_blank')
                        },
                        key: 'edit',
                        icon: <EditOutlined />
                      },
                      {
                        label: 'Delete User',
                        onClick: () => {
                          confirm({
                            title: 'Are you sure? You want to delete this user',
                            // icon: <ExclamationCircleOutlined />,
                            content: `User will loose all the access to the platform`,
                            onOk() {
                              deleteUser(
                                {
                                  id: record._id
                                },
                                {
                                  onSuccess: () => {
                                    message.open({
                                      type: 'success',
                                      content: 'User has been been deleted'
                                    })
                                  }
                                }
                              )
                            },
                            okText: 'Delete'
                          })
                        },
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

export default UsersScreen
