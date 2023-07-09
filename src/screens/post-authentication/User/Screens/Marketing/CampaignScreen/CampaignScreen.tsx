import {
  Button,
  Card,
  Col,
  Dropdown,
  Modal,
  Row,
  Space,
  Table,
  Tag
} from 'antd'
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'

import { CampaignStatus } from './Constant'
import Header from '@Components/Header'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { confirm } = Modal

function CampaignsScreen() {
  const { data, isLoading: loading } = User.Queries.useGetCampaigns()
  const { mutate: executeCampaign } = User.Queries.useExecuteCampaign()
  // const { mutate: deleteCampaign } = User.Queries.usedeletec()
  const navigate = useNavigate()

  const deleteCampaign = (id: string) => {
    confirm({
      title: 'Are you sure?',
      // icon: <ExclamationCircleOutlined />,
      content: `You want to delete this campaign?`,
      onOk() {
        // props.removeItemFromCart(id)
        // console.log('deleteing')
      },
      okText: 'Delete Campaign'
    })
  }

  return (
    <Header
      title="Campaigns"
      extra={[
        <Button onClick={() => navigate('../create-campaign')} type="primary">
          Create Campaign
        </Button>
      ]}
    >
      <Card bodyStyle={{ padding: 0 }}>
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading}>
              <Table.Column title="Title" dataIndex="title" key="title" />
              {/* <Table.Column title="Subject" dataIndex="subject" key="subject" /> */}
              <Table.Column
                title="Channel"
                dataIndex="channel"
                key="channel"
                render={(_: any, record: Types.Campaign) =>
                  record.channel.map(c => (
                    <Tag color={'blue'}>{c?.toUpperCase()}</Tag>
                  ))
                }
              />
              <Table.Column
                title="Scheduled At"
                dataIndex="scheduledAt"
                key="scheduledAt"
                render={(_: any, record: Types.Campaign) =>
                  dayjs(record.createdAt).format('DD/MM/YYYY')
                }
              />
              {/* <Table.Column
                title="Status"
                dataIndex="status"
                key="status"
                render={(_: any, record: Types.Campaign) =>
                  record.status ? (
                    <Tag color={CampaignStatus[record.status].color}>
                      {CampaignStatus[record.status].title}
                    </Tag>
                  ) : null
                }
              /> */}
              <Table.Column
                title="Created At"
                dataIndex="createdAt"
                key="createdAt"
                render={(_: any, record: Types.Campaign) =>
                  dayjs(record.createdAt).format('DD/MM/YYYY')
                }
              />

              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Campaign) => (
                  <Space size="middle">
                    <Dropdown.Button
                      // children={null}
                      size="small"
                      menu={{
                        items: [
                          {
                            key: 'execute',
                            label: 'Execute Campaign',
                            icon: <CheckOutlined />,
                            onClick: () =>
                              executeCampaign({
                                id: record._id
                              })
                          },
                          {
                            key: 'edit',
                            label: 'Edit Campaign',
                            icon: <EditOutlined />,
                            onClick: () =>
                              navigate(`../edit-campaign/${record._id}`)
                          },
                          {
                            key: 'delete',
                            label: 'Delete Campaign',
                            icon: <DeleteOutlined />,
                            onClick: () => deleteCampaign(record._id)
                          }
                        ]
                      }}
                      placement="bottomRight"
                    >
                      Action
                    </Dropdown.Button>
                    {/* <EditOutlined
                      onClick={() => navigate(`../edit-campaign/${record._id}`)}
                    />
                    <DeleteOutlined onClick={e => deleteCampaign()} /> */}
                  </Space>
                )}
              />
            </Table>
          </Col>
        </Row>
      </Card>
    </Header>
  )
}

export default CampaignsScreen
