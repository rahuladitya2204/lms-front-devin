import { Avatar, Card, Col, List, Row, Space, Table } from 'antd'

import { Learner, Types } from '@adewaskar/lms-common'
import Image from '@Components/Image'

const { Meta } = Card

function UpcomingLiveTest(props: { filter: Types.GetLiveTestssFilter }) {
  const { data, isLoading: loading } = Learner.Queries.useGetLiveTests(
    props.filter
  )
  return (
    <Card bodyStyle={{ padding: 0 }}>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3
        }}
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Card
              style={{ width: 300 }}
              cover={<Image alt="example" src={item.image} />}
              // actions={[
              //   <SettingOutlined key="setting" />,
              //   <EditOutlined key="edit" />,
              //   <EllipsisOutlined key="ellipsis" />
              // ]}
            >
              <Meta
                // avatar={
                //   <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
                // }
                title={item.title}
                description="This is the description"
              />
            </Card>
          </List.Item>
        )}
      />
      {/* <Row>
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
      </Row> */}
    </Card>
  )
}
export default UpcomingLiveTest
