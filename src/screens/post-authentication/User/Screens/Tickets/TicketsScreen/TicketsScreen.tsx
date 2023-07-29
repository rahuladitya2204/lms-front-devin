import { Button, Card, Col, Dropdown, Row, Space, Table, Tag } from 'antd'
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons'

import Header from '@Components/Header'
import { StatusMap } from '@Learner/Screens/Tickets/Constants'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'
import MoreButton from '@Components/MoreButton'
import { MenuItemType } from 'antd/es/menu/hooks/useItems'

function TicketsScreen() {
  const { data: tickets, isLoading: loading } = User.Queries.useGetTickets()
  const { mutate: updateTicketStatus } = User.Queries.useUpdateTicketStatus()
  const navigate = useNavigate()
  return (
    <Header>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Support Tickets'}
        // extra={
        //   <ActionModal cta={<Button type="primary">Add Instructor</Button>}>
        //     <AddInstructor> </AddInstructor>
        //   </ActionModal>
        // }
      >
        <Row>
          <Col span={24}>
            <Table
              onRow={r => {
                return {
                  // onClick: () => navigate(r._id + '')
                }
              }}
              dataSource={tickets}
              loading={loading}
              // onRow={() => {
              //   return {
              //     onClick: (a: any, e: any) => console.log(e, 'eee')
              //   }
              // }}
            >
              {/* <Table.Column
                title="Contact Name"
                dataIndex="contactName"
                key="contactName"
              /> */}
              <Table.Column
                title="Email Adress"
                dataIndex="contactEmail"
                key="contactEmail"
              />
              {/* <Table.Column
                title="Contact No"
                dataIndex="contactEmail"
                key="contactEmail"
              /> */}
              <Table.Column
                title="TicketId"
                render={(_: any, record: Types.Ticket) => (
                  <a
                    onClick={() => {
                      navigate(record._id + '')
                    }}
                  >
                    {record.id}
                  </a>
                )}
                dataIndex="id"
                key="id"
              />
              <Table.Column
                title="Status"
                dataIndex="status"
                key="status"
                render={(_: any, record: Types.Ticket) => (
                  <Space size="middle">
                    <Tag color={StatusMap[record.status].color}>
                      {StatusMap[record.status].text.toUpperCase()}
                    </Tag>
                  </Space>
                )}
              />
              <Table.Column title="Subject" dataIndex="subject" key="subject" />
              {/* <Table.Column
                title="Description"
                dataIndex="description"
                key="description"
              /> */}
              {/* <Table.Column title="Courses" dataIndex="courses" key="courses" />
              <Table.Column title="Rating" dataIndex="rating" key="rating" /> */}
              <Table.Column
                title="Created On"
                dataIndex="createdAt"
                key="createdAt"
                render={(_: any, record: Types.Ticket) => (
                  <Space size="middle">
                    {dayjs(record.createdAt).format('LLLL')}
                  </Space>
                )}
              />
              <Table.Column
                title="Last Reply On"
                dataIndex="lastRepliedAt"
                key="lastRepliedAt"
                render={(_: any, record: Types.Ticket) => (
                  <Space size="middle">
                    {dayjs(record.lastRepliedAt).format('LLLL')}
                  </Space>
                )}
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Ticket) => {
                  const items: MenuItemType[] = []
                  if (record.status !== 'closed') {
                    items.push(
                      {
                        label: `Mark In Progress`,
                        key: '0',
                        onClick: () => {
                          updateTicketStatus({
                            id: record._id + '',
                            status: 'in-progress'
                          })
                        }
                      },
                      {
                        label: `Close Ticket`,
                        key: '1',
                        onClick: () => {
                          updateTicketStatus({
                            id: record._id + '',
                            status: 'closed'
                          })
                        }
                      }
                    )
                  } else {
                  }

                  if (record.status !== 'closed') {
                    items.push({
                      label: 'Mark In Progress',
                      key: '0',
                      onClick: () => {
                        updateTicketStatus({
                          id: record._id + '',
                          status: 'in-progress'
                        })
                      }
                    })
                  } else {
                    items.push({
                      label: 'Reopen Ticket',
                      onClick: () => {
                        updateTicketStatus({
                          id: record._id + '',
                          status: 'opened'
                        })
                      },
                      key: '2'
                    })
                  }
                  return <MoreButton items={items} />
                }}
              />
            </Table>
          </Col>
        </Row>
      </Card>
    </Header>
  )
}

export default TicketsScreen
