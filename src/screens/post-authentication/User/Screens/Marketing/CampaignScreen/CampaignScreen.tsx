import { Button, Card, Col, Row, Space, Table, Tag } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import Header from '@Components/Header'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

function CampaignsScreen() {
  const { data, isLoading: loading } = User.Queries.useGetCampaigns();

  const navigate = useNavigate()
  return (
    <Header>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Campaigns'}
        extra={
          <Button onClick={() => navigate('../create-campaign')} type="primary">
            Create Campaign
          </Button>
        }
      >
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading}>
              <Table.Column title="Title" dataIndex="title" key="title" />
              <Table.Column title="Subject" dataIndex="subject" key="subject" />
              <Table.Column title="Channel" dataIndex="channel" key="channel" />
              <Table.Column
                title="Scheduled At"
                dataIndex="scheduledAt"
                key="scheduledAt"
                render={(_: any, record: Types.Campaign) =>
                  dayjs(record.createdAt).format('DD/MM/YYYY')
                }
              />
              <Table.Column
                title="Status"
                dataIndex="status"
                key="status"
                render={(_: any, record: Types.Campaign) =>
                  record.status ? (
                    <Tag color={'blue'}>{record.status}</Tag>
                  ) : null
                }
              />
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
                    <EditOutlined
                      onClick={() => navigate(`../edit-campaign/${record._id}`)}
                    />
                    {/* <DeleteOutlined onClick={e => deleteCampaign(record)} /> */}
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
