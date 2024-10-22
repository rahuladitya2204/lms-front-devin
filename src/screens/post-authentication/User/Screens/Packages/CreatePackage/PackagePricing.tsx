import { Button, Card, Col, Form, Input, Row, Space, Table } from "@Lib/index";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

import ActionModal from "@Components/ActionModal/ActionModal";
import CreatePlan from "@User/Screens/ExtraComponents/CreatePlan";
import { Fragment } from "react";
import { Types } from "@adewaskar/lms-common";
import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";

interface PackagePricingPropsI {
  packageId: string;
}

function PackagePricing(props: PackagePricingPropsI) {
  const { data, isFetching: loading } = User.Queries.useGetProductPlans(
    props.packageId,
    {
      enabled: !!props.packageId,
    }
  );
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Card
          bodyStyle={{ padding: 0 }}
          title={"Pricing Plan"}
          extra={
            <ActionModal cta={<Button>Add Plan</Button>}>
              <CreatePlan mode="product" product={{ type: "package", id: props.packageId }} />
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
                    return record.type !== "free"
                      ? `₹${record?.displayPrice?.value}`
                      : "";
                  }}
                  dataIndex="displayPrice.value"
                  key="displayPrice.value"
                />
                <Table.Column
                  title="Final Price"
                  render={(text, record: Types.Plan) => {
                    return record.type !== "free"
                      ? `₹${record.finalPrice.value}`
                      : "";
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
                          product={{ type: "package", id: props.packageId }}
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
      </Col>
      <Col span={24}>
        <Card title={"Coupon Codes"}>
          <Form.List name="coupons">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row key={key} gutter={16} align="middle">
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "code"]}
                        rules={[{ required: true, message: "Missing code" }]}
                      >
                        <Input placeholder="Coupon Code" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "discount", "value"]}
                        rules={[
                          { required: true, message: "Missing discount" },
                        ]}
                      >
                        <Input placeholder="Discount Value" type="number" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Space>
                        <Button
                          type="dashed"
                          onClick={() => remove(name)}
                          icon={<DeleteOutlined />}
                        >
                          Delete
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                ))}
                <Row>
                  <Col span={24}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                        style={{ width: "100%" }}
                      >
                        Add Coupon
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form.List>
        </Card>
      </Col>
    </Row>
  );
}

export default PackagePricing;
