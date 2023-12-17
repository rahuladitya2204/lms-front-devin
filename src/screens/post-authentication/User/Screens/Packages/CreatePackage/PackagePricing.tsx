import { Button, Card, Col, Form, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal/ActionModal'
import CreatePlan from '@User/Screens/ExtraComponents/CreatePlan'
import { Fragment } from 'react'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

interface PackagePricingPropsI {
  packageId: string;
}

function PackagePricing(props: PackagePricingPropsI) {
  const message = useMessage()
  const { data, isFetching: loading } = User.Queries.useGetProductPlans(
    props.packageId
  )
  return (
    <Fragment>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Pricing Plan'}
        extra={
          <ActionModal cta={<Button>Add Plan</Button>}>
            <CreatePlan product={{ type: 'package', id: props.packageId }} />
          </ActionModal>
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
                    <ActionModal cta={<EditOutlined />}>
                      <CreatePlan
                        product={{ type: 'package', id: props.packageId }}
                        plan={record}
                      />
                    </ActionModal>
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

export default PackagePricing
