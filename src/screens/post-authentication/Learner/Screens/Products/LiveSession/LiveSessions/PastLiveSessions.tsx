import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Typography
} from 'antd'

import { Learner, Types } from '@adewaskar/lms-common'

import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Text } = Typography

function PastLiveSession(props: { filter: Types.GetLiveSessionsFilter }) {
  const { data, isLoading: loading } = Learner.Queries.useGetLiveSessions(
    props.filter
  )
  return (
    <Card bodyStyle={{ padding: 0 }}>
      <Row>
        <Col span={24}>
          <Table dataSource={data} loading={loading}>
            <Table.Column title="Title" dataIndex="title" key="title" />
            <Table.Column
              title="Started At"
              dataIndex="startedAt"
              key="startedAt"
              render={(_: any, record: Types.LiveTest) => (
                <Space size="middle">
                  {dayjs(record.startedAt).format('LLL')}
                </Space>
              )}
            />
            <Table.Column
              title="Ended At"
              dataIndex="endedAt"
              key="endedAt"
              render={(_: any, record: Types.LiveTest) => (
                <Space size="middle">
                  {record.endedAt ? dayjs(record.endedAt).format('LLL') : '-'}
                </Space>
              )}
            />
            <Table.Column
              title="Recording"
              dataIndex="recording"
              key="recording"
              render={(_: any, record: Types.LiveTest) => (
                <Button size="small">View Recording</Button>
              )}
            />
            {/* <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.LiveTest) => (
                  <Space size="middle">
                    {record.recording.status?<>{record?.recording.status==='completed' ? <ViewRecording session={record} /> : <Tag color='cyan'>Processing Recording</Tag> }</>:!(record.startedAt&&record.endedAt)?<Button type='primary'
                      onClick={() =>
                        // navigate(`${record._id}/player`)
                        window.open(
                          `live-session/${record._id}/player`,
                          '_blank'
                        )
                      } size='small'
                        icon={<VideoCameraOutlined/>}
                    >Start Meeting</Button>:<Text>Meeting has ended</Text>}
                  </Space>
                )}
              /> */}
          </Table>
        </Col>
      </Row>
    </Card>
  )
}
export default PastLiveSession
