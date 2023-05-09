import { Button, Card, Col, Row, Space, Table } from 'antd'
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
                    {dayjs(record.scheduledAt).format('LLLL')}
                  </Space>
                )}
              />
              <Table.Column
                title="Duration"
                dataIndex="duration"
                key="duration"
                render={(_: any, record: Types.LiveSession) => (
                  <>{record.duration} mins</>
                )}
              />
              <Table.Column
                title="Total Attendees"
                dataIndex="Attendees"
                key="Attendees"
                render={(_: any, record: Types.LiveSession) => (
                  <>{record.attendees.length} </>
                )}
              />
                <Table.Column
                title="Recording"
                dataIndex="recording"
                key="recording"
                render={(_: any, record: Types.LiveSession) => record?.recording?.file?<ViewRecording fileId={record.recording.file} />:null}
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.LiveSession) => (
                  <Space size="middle">
                    <VideoCameraOutlined
                      onClick={() =>
                        // navigate(`${record._id}/player`)
                        window.open(
                          `live-session/${record._id}/player`,
                          '_blank'
                        )
                      }
                      
                    />
                        <EditOutlined onClick={()=>navigate(`${record._id}/edit`)} />
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

export default LiveSessionsScreen
