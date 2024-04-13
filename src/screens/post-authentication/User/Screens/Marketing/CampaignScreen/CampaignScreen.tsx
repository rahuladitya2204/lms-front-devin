import {
  Button,
  Card,
  Col,
  Dropdown,
  Modal,
  Row,
  Space,
  Table,
  Tag,
} from "@Lib/index";
import { CheckOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Enum, Types, Utils } from "@adewaskar/lms-common";

import { CampaignStatus } from "./Constant";
import Header from "@User/Screens/UserRoot/UserHeader";
import MoreButton from "@Components/MoreButton";
import { NavLink } from "@Router/index";
import { User } from "@adewaskar/lms-common";
import dayjs from "dayjs";
import { useNavigate } from "@Router/index";

const { confirm } = Modal;

function CampaignsScreen() {
  const { data, isFetching: loading } = User.Queries.useGetCampaigns();
  const { mutate: executeCampaign } = User.Queries.useExecuteCampaign();
  const { mutate: deleteCampaignApi, isLoading: deletingCampaign } =
    User.Queries.useDeleteCampaign();
  // const { mutate: deleteCampaign } = User.Queries.usedeletec()
  const navigate = useNavigate();

  const deleteCampaign = (id: string) => {
    confirm({
      title: "Are you sure?",
      // icon: <ExclamationCircleOutlined />,
      content: `You want to delete this campaign?`,
      onOk() {
        deleteCampaignApi({ id });
      },
      okText: "Delete Campaign",
    });
  };

  return (
    <Header
      title="Campaigns"
      extra={[
        <Button onClick={() => navigate("../create-campaign")} type="primary">
          Create Campaign
        </Button>,
      ]}
    >
      <Card bodyStyle={{ padding: 0 }}>
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loading || deletingCampaign}>
              <Table.Column
                title="Title"
                dataIndex="title"
                key="title"
                render={(_: any, record: Types.Campaign) => (
                  <NavLink
                    title={record.title}
                    to={`../edit-campaign/${record._id}`}
                  >
                    {record.title}
                  </NavLink>
                )}
              />
              {/* <Table.Column title="Subject" dataIndex="subject" key="subject" /> */}
              <Table.Column
                responsive={["md"]}
                title="Channel"
                dataIndex="channel"
                key="channel"
                render={(_: any, record: Types.Campaign) =>
                  record.channel.map((c) => (
                    <Tag color={"blue"}>{c?.toUpperCase()}</Tag>
                  ))
                }
              />
              <Table.Column
                title="Scheduled At"
                dataIndex="scheduledAt"
                responsive={["md"]}
                key="scheduledAt"
                render={(_: any, record: Types.Campaign) =>
                  dayjs(record.createdAt).format("LLL")
                }
              />
              <Table.Column
                title="Status"
                dataIndex="status"
                key="status"
                render={(_: any, record: Types.Campaign) =>
                  record.status ? (
                    <Tag color={CampaignStatus[record?.status]?.color}>
                      {CampaignStatus[record?.status]?.title}
                    </Tag>
                  ) : null
                }
              />
              <Table.Column
                title="Created At"
                dataIndex="createdAt"
                responsive={["md"]}
                key="createdAt"
                render={(_: any, record: Types.Campaign) =>
                  dayjs(record.createdAt).format("LLL")
                }
              />

              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Campaign) =>
                  record.status === Enum.CampaignStatus.DRAFT ? (
                    <Space size="middle">
                      <MoreButton
                        items={[
                          // @ts-ignore
                          !Utils.validateCampaign(record)
                            ? {
                                key: "execute",
                                label: "Execute Campaign",
                                // icon: <CheckOutlined />,
                                onClick: () =>
                                  executeCampaign({
                                    id: record._id,
                                  }),
                              }
                            : null,
                          {
                            key: "edit",
                            label: "Edit Campaign",
                            // icon: <EditOutlined />,
                            onClick: () =>
                              navigate(`../edit-campaign/${record._id}`),
                          },
                          {
                            key: "delete",
                            label: "Delete Campaign",
                            // icon: <DeleteOutlined />,
                            onClick: () => deleteCampaign(record._id),
                          },
                        ]}
                      />
                    </Space>
                  ) : (
                    "-"
                  )
                }
              />
            </Table>
          </Col>
        </Row>
      </Card>
    </Header>
  );
}

export default CampaignsScreen;
