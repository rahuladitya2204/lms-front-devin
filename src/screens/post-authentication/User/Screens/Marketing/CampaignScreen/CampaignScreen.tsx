import { Button, Card, Col, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import Header from '@Components/Header'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { useNavigate } from 'react-router'

function CampaignsScreen() {
  const { data, isLoading: loading } = User.Queries.useGetCampaigns()
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
                title="Last Login"
                dataIndex="lastActive"
                key="lastActive"
              />
              {/* <Table.Column title="Courses" dataIndex="courses" key="courses" />
              <Table.Column title="Rating" dataIndex="rating" key="rating" /> */}
              <Table.Column
                title="Joined On"
                dataIndex="createdAt"
                key="createdAt"
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Campaign) => (
                  <Space size="middle">
                    <EditOutlined
                      onClick={() => navigate(`../edit-campaign/${record._id}`)}
                    />
                    <DeleteOutlined />
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
