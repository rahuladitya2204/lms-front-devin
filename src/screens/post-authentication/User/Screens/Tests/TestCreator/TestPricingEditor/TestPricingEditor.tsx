import { Button, Card, Col, Form, Row, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal/ActionModal'
import CreatePlan from '../../../ExtraComponents/CreatePlan'
import { Fragment } from 'react'
import { Types } from '@invinciblezealorg/lms-common'
import { User } from '@invinciblezealorg/lms-common'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'

interface TestPricingEditorPropsI {
  testId: string;
  saveTest: Function;

  test: Types.Test;
}

function TestPricingEditor(props: TestPricingEditorPropsI) {
  const message = useMessage()
  const { data, isFetching: loading } = User.Queries.useGetProductPlans(
    props.testId
  )
  const { openModal } = useModal()
  return (
    <Fragment>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Pricing Plan'}
        extra={
          <Button
            onClick={() =>
              openModal(
                <CreatePlan product={{ type: 'test', id: props.testId }} />
              )
            }
          >
            Add Plan
          </Button>
          // <ActionModal cta={<Button>Add Plan</Button>}>
          //   <CreatePlan product={{ type: 'test', id: props.testId }} />
          // </ActionModal>
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
                    : 'Free'
                }}
                dataIndex="displayPrice.value"
                key="displayPrice.value"
              />
              <Table.Column
                title="Final Price"
                render={(text, record: Types.Plan) => {
                  return record.type !== 'free'
                    ? `₹${record.finalPrice.value}`
                    : 'Free'
                }}
                dataIndex="finalPrice.value"
                key="finalPrice.value"
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Plan) => (
                  <Space size="middle">
                    <EditOutlined
                      onClick={() => {
                        openModal(
                          <CreatePlan
                            product={{ type: 'test', id: props.testId }}
                            plan={record}
                          />
                        )
                      }}
                    />
                    {/* <ActionModal cta={<EditOutlined />}>
                      <CreatePlan
                        product={{ type: 'test', id: props.testId }}
                        plan={record}
                      />
                    </ActionModal> */}
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

export default TestPricingEditor
