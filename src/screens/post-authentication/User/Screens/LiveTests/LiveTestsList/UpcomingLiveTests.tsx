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
import dayjs from 'dayjs'

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

            <Table.Column
              title="Max Score"
              dataIndex="maxScore"
              key="maxScore"
              render={(_: any, record: Types.LiveTest) => (
                <Space size="middle">{record.maxScore}</Space>
              )}
            />

            <Table.Column
              title="Duration(in mins)"
              dataIndex="duration"
              key="duration"
              render={(_: any, record: Types.LiveTest) => (
                <Space size="middle">{record.duration}</Space>
              )}
            />

            <Table.Column
              title="Batch Limit"
              dataIndex="batchLimit"
              key="batchLimit"
              render={(_: any, record: Types.LiveTest) => (
                <Space size="middle">{record.batchLimit}</Space>
              )}
            />
          </Table>
        </Col>
      </Row>
    </Card>
  )
}
export default UpcomingLiveTest
