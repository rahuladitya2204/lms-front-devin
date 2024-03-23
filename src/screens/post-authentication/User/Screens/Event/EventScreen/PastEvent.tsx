import { Button, Card, Col, Row, Space, Table, Tabs, Tag, Typography } from 'antd'

import Header from '@Components/Header'
import { Types } from '@invinciblezealorg/lms-common'
import { User } from '@invinciblezealorg/lms-common'
import { VideoCameraOutlined } from '@ant-design/icons'
import ViewRecording from '../RecordingPlayer'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Text } = Typography;

function PastEvent(props:{filter:Types.GetEventsFilter}) {
  const { data, isFetching: loading } = User.Queries.useGetEvents(props.filter);
  return (
      <Card
        bodyStyle={{ padding: 0 }}
      >
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading}>
              <Table.Column title="Title" dataIndex="title" key="title" />
                <Table.Column
                title="Started At"
                dataIndex="startedAt"
                key="startedAt"
                render={(_: any, record: Types.Event) => (
                  <Space size="middle">
                    {dayjs(record.startedAt).format('LLL')}
                  </Space>
                )}
              />
                <Table.Column
                title="Ended At"
                dataIndex="endedAt"
                key="endedAt"
                render={(_: any, record: Types.Event) => (
                  <Space size="middle">
                    {record.endedAt ?dayjs(record.endedAt).format('LLL'):'-'}
                  </Space>
                )}
              />
              <Table.Column
                title="Total Attendees"
                dataIndex="Attendees"
                key="Attendees"
                render={(_: any, record: Types.Event) => (
                  <>{record.attendees.length} </>
                )}
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Event) => (
                  <Space size="middle">
                    {record.recording.status?<>{record?.recording.status==='completed' ? <ViewRecording session={record} /> : <Tag color='cyan'>Processing Recording</Tag> }</>:!(record.startedAt&&record.endedAt)?<Button type='primary'
                      onClick={() =>
                        // navigate(`${record._id}/player`)
                        window.open(
                          `event/${record._id}/player`,
                          '_blank'
                        )
                      } size='small'
                        icon={<VideoCameraOutlined/>}
                    >Start Meeting</Button>:<Text>Meeting has ended</Text>}
                  </Space>
                )}
              />
            </Table>
          </Col>
        </Row>
      </Card>
  )
}
export default PastEvent
