import { Button, Card, Col, Form, Row, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import ActionModal from "@Components/ActionModal/ActionModal";
import CreateCoursePlan from "./CreateCoursePlan";
import CreatePlan from "@User/Screens/ExtraComponents/CreatePlan";
import { Fragment } from "react";
import { Types } from "@adewaskar/lms-common";
import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";
import { useParams } from "@Router/index";

interface CoursePricingEditorPropsI {
  // courseId: string;
  // saveCourse: Function;

  // course: Types.Course;
}

function CoursePricingEditor(props: CoursePricingEditorPropsI) {
  const { id: courseId } = useParams();
  const { data, isFetching: loading } = User.Queries.useGetProductPlans(
    courseId + '',
    {
      enabled: !!courseId,
    }
  );
  return (
    <Fragment>
      <Card
        bodyStyle={{ padding: 0 }}
        title={"Pricing Plan"}
        extra={
          <ActionModal cta={<Button>Add Plan</Button>}>
            <CreatePlan mode="product" product={{ type: "course", id: courseId + '' }} />
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
                        mode='product'
                        product={{ type: "course", id: courseId + '' }}
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
  );
}

export default CoursePricingEditor;
