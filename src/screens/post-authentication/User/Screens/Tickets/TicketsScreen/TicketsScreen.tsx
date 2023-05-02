import { Button, Card, Col, Dropdown, Row, Space, Table, Tag } from 'antd'
import { DeleteOutlined, DownOutlined, EditOutlined } from '@ant-design/icons'

import Header from '@Components/Header'
import { StatusMap } from '@Learner/Screens/Tickets/Constants'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

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
                render={(_: any, record: Types.Ticket) => (
                  <Dropdown.Button
                    menu={{
                      items: [
                        // record.status !== 'closed'
                        //   ? {
                        //       label: <a>Mark as Blocked</a>,
                        //       key: '0123'
                        //     }
                        //   : null,
                        record.status !== 'closed'
                          ? {
                              label: (
                                <a
                                  onClick={() => {
                                    updateTicketStatus({
                                      id: record._id + '',
                                      status: 'in-progress'
                                    })
                                  }}
                                >
                                  Mark In Progress
                                </a>
                              ),
                              key: '0'
                            }
                          : null,
                        record.status !== 'closed'
                          ? {
                              label: (
                                <a
                                  onClick={() => {
                                    updateTicketStatus({
                                      id: record._id + '',
                                      status: 'closed'
                                    })
                                  }}
                                >
                                  Close Ticket
                                </a>
                              ),
                              key: '1'
                            }
                          : null,
                        record.status === 'closed'
                          ? {
                              label: (
                                <a
                                  onClick={() => {
                                    updateTicketStatus({
                                      id: record._id + '',
                                      status: 'opened'
                                    })
                                  }}
                                >
                                  Reopen Ticket
                                </a>
                              ),
                              key: '2'
                            }
                          : null
                        // {
                        //   label: <a>2nd menu item</a>,
                        //   key: '1'
                        // }
                      ]
                    }}
                    trigger={['click']}
                  >
                    More
                  </Dropdown.Button>
                )}
              />
            </Table>
          </Col>
        </Row>
      </Card>
    </Header>
  )
}

export default TicketsScreen
