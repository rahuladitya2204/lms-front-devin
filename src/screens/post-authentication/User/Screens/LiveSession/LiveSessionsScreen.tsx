import { Button, Card, Col, Row, Space, Table, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, VideoCameraOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import AddLiveSession from './AddLiveSession'
import Header from '@Components/Header'
import MediaPlayer from '@Components/MediaPlayer/MediaPlayer'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import ViewRecording from './RecordingPlayer'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Text } = Typography;

function LiveSessionsScreen() {
  const { data, isLoading: loading } = User.Queries.useGetLiveSessions()
  const navigate = useNavigate();
  return (
    <Header  title='Live Session' extra={
[      <Button type="primary" onClick={()=>navigate(`create`)}>Create Live Session</Button>
]    }> 
      <Card
        bodyStyle={{ padding: 0 }}
      >
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading}>
              <Table.Column title="Title" dataIndex="title" key="title" />
              <Table.Column
                title="Scheduled for"
                dataIndex="scheduledAt"
                key="scheduledAt"
                render={(_: any, record: Types.LiveSession) => (
                  <Space size="middle">
                    {dayjs(record.scheduledAt).format('LLL')}
                  </Space>
                )}
              />
                <Table.Column
                title="Started At"
                dataIndex="startedAt"
                key="startedAt"
                render={(_: any, record: Types.LiveSession) => (
                  <Space size="middle">
                    {dayjs(record.startedAt).format('LLL')}
                  </Space>
                )}
              />
                <Table.Column
                title="Ended At"
                dataIndex="endedAt"
                key="endedAt"
                render={(_: any, record: Types.LiveSession) => (
                  <Space size="middle">
                    {dayjs(record.endedAt).format('LLL')}
                  </Space>
                )}
              />
              {/* <Table.Column
                title="Duration"
                dataIndex="duration"
                key="duration"
                render={(_: any, record: Types.LiveSession) => (
                  <>{record.duration} mins</>
                )}
              /> */}
              <Table.Column
                title="Total Attendees"
                dataIndex="Attendees"
                key="Attendees"
                render={(_: any, record: Types.LiveSession) => (
                  <>{record.attendees.length} </>
                )}
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.LiveSession) => (
                  <Space size="middle">
                    {record?.recording?.file ? <ViewRecording fileId={record.recording.file} /> : null}
                    {!(record.startedAt&&record.endedAt)?<VideoCameraOutlined
                      onClick={() =>
                        // navigate(`${record._id}/player`)
                        window.open(
                          `live-session/${record._id}/player`,
                          '_blank'
                        )
                      }
                      
                    />:<Text>Meeting has ended</Text>}
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

export default LiveSessionsScreen
