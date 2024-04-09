import { Button, Card, Col, Row, Space, Table, Tabs, Tag } from "@Lib/index";

import Header from "@Components/Header";
import { Types } from "@adewaskar/lms-common";
import { Typography } from "@Components/Typography";
import { User } from "@adewaskar/lms-common";
import { VideoCameraOutlined } from "@ant-design/icons";
import ViewRecording from "../RecordingPlayer";
import dayjs from "dayjs";
import { useNavigate } from "@Router/index";

const { Text } = Typography;

function UpcomingEvent(props: { filter: Types.GetEventsFilter }) {
  const navigate = useNavigate();
  const { data, isFetching: loading } = User.Queries.useGetEvents(props.filter);
  return (
    <Card bodyStyle={{ padding: 0 }}>
      <Row>
        <Col span={24}>
          <Table dataSource={data} loading={loading}>
            <Table.Column
              render={(_: any, record: Types.Event) => record.title}
              title="Title"
              dataIndex="title"
              key="title"
            />
            <Table.Column
              title="Scheduled for"
              dataIndex="scheduledAt"
              key="scheduledAt"
              render={(_: any, record: Types.Event) => (
                <Space size="middle">
                  {dayjs(record.scheduledAt).format("LLL")}
                </Space>
              )}
            />

            <Table.Column
              title="Category"
              key="Category"
              render={(_: any, record: Types.Event) => (
                <Space size="middle">
                  <>{record.type}</>
                  <Button
                    onClick={() => navigate(`${record._id}/edit`)}
                    size="small"
                  >
                    Edit
                  </Button>
                  {/* {record.recording.status?<>{record?.recording.status==='completed' ? <ViewRecording session={record} /> : <Tag color='cyan'>Processing Recording</Tag> }</>:!(record.startedAt&&record.endedAt)?<Button type='primary'
                      onClick={() =>
                        // navigate(`${record._id}/player`)
                        window.open(
                          `event/${record._id}/player`,
                          '_blank'
                        )
                      } size='small'
                        icon={<VideoCameraOutlined/>}
                    >Start Meeting</Button>:<Text>Meeting has ended</Text>} */}
                </Space>
              )}
            />
          </Table>
        </Col>
      </Row>
    </Card>
  );
}
export default UpcomingEvent;
