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

import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { VideoCameraOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'

const { Text } = Typography

function UpcomingLiveTest(props: { filter: Types.GetLiveTestssFilter }) {
  const { data, isLoading: loading } = User.Queries.useGetLiveTests(
    props.filter
  )
  return (
    <Card bodyStyle={{ padding: 0 }}>
      <Row>
        <Col span={24}>
          <Table dataSource={data} loading={loading}>
            <Table.Column title="Title" dataIndex="title" key="title" />
            <Table.Column
              title="Scheduled for"
              dataIndex="scheduledAt"
              key="scheduledAt"
              render={(_: any, record: Types.LiveTest) => (
                <Space size="middle">
                  {dayjs(record.scheduledAt).format('LLL')}
                </Space>
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
export default UpcomingLiveTest
