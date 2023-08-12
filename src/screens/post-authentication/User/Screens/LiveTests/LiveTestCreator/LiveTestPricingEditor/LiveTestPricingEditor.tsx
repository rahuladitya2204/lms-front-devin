import { Button, Card, Col, Form, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import CreateLiveTestPlan from './CreateLiveTestPlan'
import { Fragment } from 'react'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

interface LiveTestPricingEditorPropsI {
  liveTestId: string;
  saveLiveTest: Function;

  liveTest: Types.LiveTest;
}

function LiveTestPricingEditor(props: LiveTestPricingEditorPropsI) {
  const message = useMessage()
  const { data, isLoading: loading } = User.Queries.useGetProductPlans(
    props.liveTestId
  )
  return (
    <Fragment>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Pricing Plan'}
        extra={
          <CreateLiveTestPlan liveTestId={props.liveTestId}>
            <Button>Add Plan</Button>
          </CreateLiveTestPlan>
        }
      >
        <Row>
          <Col span={24}>
            <Table pagination={false} dataSource={data} loading={loading}>
              {/* <Table.Column title="Name" dataIndex="name" key="name" /> */}
              <Table.Column title="Plan Type" dataIndex="type" key="type" />
              <Table.Column
                title="Listing Price"
                render={(text, record: Types.Plan) => {
                  return record.type !== 'free'
                    ? `₹${record?.displayPrice?.value}`
                    : ''
                }}
                dataIndex="displayPrice.value"
                key="displayPrice.value"
              />
              <Table.Column
                title="Final Price"
                render={(text, record: Types.Plan) => {
                  return record.type !== 'free'
                    ? `₹${record.finalPrice.value}`
                    : ''
                }}
                dataIndex="finalPrice.value"
                key="finalPrice.value"
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Plan) => (
                  <Space size="middle">
                    <CreateLiveTestPlan
                      liveTestId={props.liveTestId}
                      plan={record}
                    >
                      <EditOutlined />
                    </CreateLiveTestPlan>
                    <DeleteOutlined />
                  </Space>
                )}
              />
            </Table>
          </Col>
        </Row>
      </Card>
    </Fragment>
  )
}

export default LiveTestPricingEditor
