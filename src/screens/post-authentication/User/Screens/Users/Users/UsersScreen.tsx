import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Space,
  message,
  Form,
  Switch,
} from "@Lib/index";
import {
  DeleteOutlined,
  EditOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import Table, { TableColumn } from "@Components/Table/TableComponent";

import ActionModal from "@Components/ActionModal/ActionModal";
import AddUser from "./AddUser";
import Container from "@Components/Container";
import Header from "@User/Screens/UserRoot/UserHeader";
import MoreButton from "@Components/MoreButton";
import { Enum, Types } from "@adewaskar/lms-common";
import { User } from "@adewaskar/lms-common";
import dayjs from "dayjs";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";
import { useState } from "react";
import UserAccountStatusTag from "./UserAccountStatusTag";
import UserLogs from "./UserLogs";

const { confirm } = Modal;

function UsersScreen() {
  const [isDel, setShowDel] = useState(false);
  const { data, isFetching: loading } = User.Queries.useGetUsers();
  const { openModal } = useModal();
  const { mutate: deleteUser, isLoading: deletingUser } =
    User.Queries.useDeleteUser();
  return (
    <Header
      title={"Users"}
      extra={[
        <Button
          onClick={() => {
            openModal(<AddUser> </AddUser>);
          }}
          type="primary"
        >
          Add User
        </Button>,
        // <ActionModal cta={<Button type="primary">Add User</Button>}>
        //   <AddUser> </AddUser>
        // </ActionModal>
      ]}
    >
      <Container>
        <Row>
          <Col span={24}>
            <Table
              searchFields={["name", "contactNo", "email"]}
              dataSource={
                isDel
                  ? data.filter(
                      (i) => i.status !== Enum.UserAccountStatus.ACTIVE
                    )
                  : data.filter(
                      (i) => i.status === Enum.UserAccountStatus.ACTIVE
                    )
              }
              loading={loading || deletingUser}
              extra={[
                <Form.Item label="Show Deleted Users">
                  <Switch
                    checked={!!isDel}
                    onChange={(e) => {
                      console.log(e, "eeee");
                      setShowDel(e);
                    }}
                  />
                </Form.Item>,
              ]}
            >
              <TableColumn
                title="Name"
                dataIndex="name"
                key="name"
                render={(_: any, record: Types.User) => (
                  <>
                    {record.name}
                    {/* {record.status === Enum.UserAccountStatus.DELETED
                      ? `[DELETED]`
                      : null} */}
                  </>
                )}
              />

              {/* <TableColumn
                render={(_: any, record: Types.User) => (
                  <Space size="middle">{record.email || "-"}</Space>
                )}
                title="Email"
                dataIndex="email"
                key="email"
              /> */}
              <TableColumn
                title="Last Login"
                dataIndex="lastLogin"
                key="lastLogin"
                render={(_: any, record: Types.User) => (
                  <Space size="middle">
                    {dayjs(record.lastActive).format("LLL")}
                  </Space>
                )}
              />
              <TableColumn
                title="Contact No"
                dataIndex="contactNo"
                key="contactNo"
              />
              <TableColumn
                title="Status"
                dataIndex="status"
                key="status"
                render={(_: any, record: Types.User) => (
                  <Space size="middle">
                    <UserAccountStatusTag user={record} />
                  </Space>
                )}
              />

              <TableColumn
                title="Monitoring"
                dataIndex="monitoring.enabled"
                key="monitoring.enabled"
                render={(_: any, record: Types.User) =>
                  record?.monitoring?.enabled ? "Yes" : "-"
                }
              />

              <TableColumn title="Roles" dataIndex="roles" key="roles" />
              {/* <TableColumn
                title="Designation"
                dataIndex="designation"
                key="designation"
              /> */}

              {/* <TableColumn title="Courses" dataIndex="courses" key="courses" />
              <TableColumn title="Rating" dataIndex="rating" key="rating" /> */}
              <TableColumn
                title="Joined On"
                dataIndex="createdAt"
                key="createdAt"
                render={(_: any, record: Types.User) => (
                  <Space size="middle">
                    {dayjs(record.createdAt).format("LL")}
                  </Space>
                )}
              />
              <TableColumn
                title="Action"
                key="action"
                render={(_: any, record: Types.User) => (
                  <MoreButton
                    items={[
                      {
                        label: "Edit User",
                        onClick: () => {
                          openModal(<AddUser data={record} />);
                        },
                        key: "edit",
                        icon: <EditOutlined />,
                      },
                      {
                        label: "Show Logs",
                        onClick: () => {
                          openModal(<UserLogs id={record._id} />, {
                            title: `${record.name}'s work updates`,
                          });
                        },
                        key: "logs",
                        icon: <PaperClipOutlined />,
                      },
                      {
                        label: "Delete User",
                        onClick: () => {
                          confirm({
                            title: "Are you sure? You want to delete this user",
                            // icon: <ExclamationCircleOutlined />,
                            content: `User will loose all the access to the platform`,
                            onOk() {
                              deleteUser(
                                {
                                  id: record._id,
                                },
                                {
                                  onSuccess: () => {
                                    message.open({
                                      type: "success",
                                      content: "User has been been deleted",
                                    });
                                  },
                                }
                              );
                            },
                            okText: "Delete",
                          });
                        },
                        key: "delete",
                        icon: <DeleteOutlined />,
                      },
                    ]}
                  />
                )}
              />
            </Table>
          </Col>
        </Row>
      </Container>
    </Header>
  );
}

export default UsersScreen;
