import {
  BarChartOutlined,
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Table,
  Tag,
} from "@Lib/index";
import slugify from "slugify";
import Header from "@User/Screens/UserRoot/UserHeader";
import { Types, Utils } from "@adewaskar/lms-common";
import { User } from "@adewaskar/lms-common";
import { useNavigate } from "@Router/index";
import { useModal } from "@Components/ActionModal/ModalContext";
import { ReactNode } from "react";
import CreatePlan from "../ExtraComponents/CreatePlan";
import MoreButton from "@Components/MoreButton";
import { Text } from "@Components/Typography/Typography";

function PlansScreen() {
  const { data, isFetching: loading } = User.Queries.useGetGlobalPlans();
  const { mutate: deletePlan, isLoading: deletingPlan } =
    User.Queries.useDeleteGlobalPlan();
  const navigate = useNavigate();
  const { openModal } = useModal();
  return (
    <Header
      title={"Plans"}
      extra={[
        <Button
          onClick={() => openModal(<CreatePlan mode="global" />)}
          type="primary"
        >
          Create New Plan
        </Button>,
      ]}
    >
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Table loading={loading || deletingPlan} dataSource={data}>
            <Table.Column
              title="Title"
              dataIndex="title"
              key="title"
              render={(_: any, bundle: Types.Plan) => (
                <Text
                //   onClick={() =>
                //     navigate(`/admin/products/package/${bundle._id}/editor`)
                //   }
                // type="link"
                // size="small"
                >
                  {bundle.title}
                </Text>
              )}
            />
            <Table.Column
              title="Display Price"
              dataIndex="slug"
              key="slug"
              render={(_: any, plan: Types.Plan) =>
                Utils.UnitTypeToStr(plan.displayPrice) || "-"
              }
            />
            <Table.Column
              title="Final Price"
              dataIndex="slug"
              key="slug"
              render={(_: any, plan: Types.Plan) =>
                Utils.UnitTypeToStr(plan.finalPrice) || "-"
              }
            />
            <Table.Column
              title="Duration"
              dataIndex="subscription.duration"
              key="subscription.duration"
              render={(_: any, bundle: Types.Plan) =>
                `${bundle.subscription?.duration} days`
              }
            />
            <Table.Column
              title="Grace Period"
              dataIndex="subscription.gracePeriod"
              key="subscription.gracePeriod"
              render={(_: any, bundle: Types.Plan) =>
                `${bundle.subscription?.gracePeriod} days`
              }
            />

            {/* <Table.Column
              title="Renewal"
              dataIndex="subscription.gracePeriod"
              key="subscription.gracePeriod"
              render={(_: any, bundle: Types.Plan) =>
                `${bundle.subscription?.gracePeriod} days`
              }
            /> */}
            {/* <Table.Column
                title="Questions"
                dataIndex="status"
                key="status"
                render={(_: any, bundle: Types.Plan) =>
                  bundle.sections.map(i => i.items).flat().length
                }
              /> */}
            {/* <Table.Column
              title="Status"
              dataIndex="status"
              key="status"
              // @ts-ignore
              render={(_: any, bundle: Types.Plan) => (
                // @ts-ignore
                <PlanStatusTag bundle={bundle} />
              )}
            /> */}

            {/* <Table.Column
              title="Enrolled"
              dataIndex="enrolled"
              key="enrolled"
              render={(_: any, bundle: Types.Plan) =>
                bundle.analytics.enrolled.count
              }
            /> */}
            {/* <Table.Column
                title="Duration"
                dataIndex="duration"
                key="duration"
                render={(_: any, bundle: Types.Plan) =>
                  bundle.duration.enabled ? bundle.duration.value + ' mins' : '-'
                }
              /> */}
            <Table.Column
              title="Action"
              key="action"
              render={(_: any, plan: Types.Plan, index: number) => (
                <MoreButton
                  items={[
                    {
                      label: "Edit Plan",
                      key: "edit-plan",
                      icon: <SettingOutlined />,
                      onClick: () => {
                        openModal(<CreatePlan mode="global" plan={plan} />);
                      },
                    },
                    {
                      label: "Delete Plan",
                      key: "delete-plan",
                      icon: <DeleteOutlined />,
                      onClick: () => {
                        Modal.confirm({
                          closable: false,
                          title: `Are you sure?`,
                          // icon: <ExclamationCircleOutlined />,
                          content: `You want to delete this plan?`,
                          // footer: [

                          // ],
                          onOk() {
                            deletePlan(plan._id, {
                              onSuccess: () => {
                                message.success("Plan deleted successfully");
                              },
                            });
                          },
                          okText: "Yes, Delete",
                        });
                      },
                    },
                  ]}
                />
              )}
            />
          </Table>
        </Col>
      </Row>
      {/* <Card
          bodyStyle={{ padding: 0 }}
          title={'Plans'}
          extra={
            <ActionModal cta={<Button type="primary">Create New Plan</Button>}>
              <AddPlan> </AddPlan>
            </ActionModal>
          }
        >
          <Row>
            <Col span={24}>
  
            </Col>
          </Row>
        </Card> */}
    </Header>
  );
}

export default PlansScreen;
