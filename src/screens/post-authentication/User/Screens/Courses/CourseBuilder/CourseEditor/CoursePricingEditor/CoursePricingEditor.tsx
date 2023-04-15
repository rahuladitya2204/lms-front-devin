import { Button, Card, Col, Form, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import CreateCoursePlan from './CreateCoursePlan'
import { Fragment } from 'react'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'

interface CoursePricingEditorPropsI {
  formData: Partial<Types.Course>;
  courseId: string;
  onFormUpdate: (d: Partial<Types.Course>) => void;
}

function CoursePricingEditor(props: CoursePricingEditorPropsI) {
  // const
  const { data, isLoading: loading } = User.Queries.useGetCoursePlans(
    props.courseId
  )
  return (
    <Fragment>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Pricing Plan'}
        extra={
          <CreateCoursePlan courseId={props.courseId}>
            <Button>Add Plan</Button>
          </CreateCoursePlan>
        }
      >
        <Row>
          <Col span={24}>
            <Table pagination={false} dataSource={data} loading={loading}>
              <Table.Column title="Name" dataIndex="name" key="name" />
              <Table.Column title="Plan Type" dataIndex="type" key="type" />
              <Table.Column
                title="Listing Price"
                render={(text, record: Types.Plan) => {
                  return `₹${record?.displayPrice?.value}`
                }}
                dataIndex="displayPrice.value"
                key="displayPrice.value"
              />
              <Table.Column
                title="Final Price"
                render={(text, record: Types.Plan) => {
                  return `₹${record.finalPrice.value}`
                }}
                dataIndex="finalPrice.value"
                key="finalPrice.value"
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Plan) => (
                  <Space size="middle">
                    <CreateCoursePlan courseId={props.courseId} plan={record}>
                      <EditOutlined />
                    </CreateCoursePlan>
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

export default CoursePricingEditor
