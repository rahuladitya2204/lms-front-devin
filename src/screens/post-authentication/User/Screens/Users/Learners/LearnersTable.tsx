import { Button, Card, Col, Modal, Row, Space, Tag, message } from "@Lib/index";
import { CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Enum, Learner, Types } from "@adewaskar/lms-common";
import Table, { TableColumn } from "@Components/Table/TableComponent";

import AddLearner from "./AddLearners";
import MoreButton from "@Components/MoreButton";
import { User } from "@adewaskar/lms-common";
import dayjs from "dayjs";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";
import { sortBy } from "lodash";

const confirm = Modal.confirm;

function LearnersTable() {
  const { data, isFetching: loading } = User.Queries.useGetLearners();
  const { mutate: deleteLearner, isLoading: deletingLearner } =
    User.Queries.useDeleteLearner();
  const { data: categories } = Learner.Queries.useGetLearnerCategories();
  const { mutate: changeAccountStatus } =
    User.Queries.useUpdateLearnerAccountStatus();
  const { openModal } = useModal();
  return (
    <Table
      searchFields={["name", "email", "contactNo"]}
      dataSource={sortBy(data, ["-lastActive"])}
      loading={loading || deletingLearner}
    >
      <TableColumn
        title="Name"
        render={(_: any, record: Types.Learner) => record.name || "-"}
        dataIndex="name"
        key="name"
      />
      <TableColumn
        title="Email Adress"
        dataIndex="email"
        key="email"
        render={(_: any, record: Types.Learner) => record.email || "-"}
      />
      <TableColumn title="Contact No" dataIndex="contactNo" key="contactNo" />
      <TableColumn
        title="Interests"
        render={(_: any, record: Types.Learner) =>
          record.interests
            .map((i) => categories.find((c) => c._id === i.id)?.title)
            .filter((i) => i)
            .join(", ") || "-"
        }
      />
      <TableColumn
        title="Profile Status"
        dataIndex="profile.status"
        key="profile.status"
        render={(_: any, record: Types.Learner) =>
          record.profile.status === "incomplete" ? (
            <Tag color="red-inverse">Incomplete</Tag>
          ) : (
            <Tag color="green-inverse">Complete</Tag>
          )
        }
      />
      <TableColumn
        title="Last Login"
        dataIndex="lastActive"
        key="lastActive"
        render={(_: any, record: Types.Learner) =>
          record.lastActive ? (
            <Space size="middle">
              {dayjs(record.lastActive).format("LLLL")}
            </Space>
          ) : (
            "-"
          )
        }
      />
      <TableColumn
        title="Joined On"
        dataIndex="createdAt"
        key="createdAt"
        render={(_: any, record: Types.Learner) => (
          <Space size="middle">{dayjs(record.createdAt).format("LLLL")}</Space>
        )}
      />
      <TableColumn
        title="Action"
        key="action"
        render={(_: any, record: Types.Learner) => (
          <MoreButton
            items={[
              {
                label: "Edit Learner",
                icon: <EditOutlined />,
                key: "edit-learner",
                onClick: () => {
                  openModal(<AddLearner data={record} />);
                },
              },
              {
                label:
                  record.status === Enum.LearnerAccountStatus.ACTIVE
                    ? "Revoke Access"
                    : "Release Access",
                key: "change-status",
                icon: <CloseOutlined />,
                onClick: () => {
                  confirm({
                    title: "Are you sure?",
                    // icon: <ExclamationCircleOutlined />,
                    content: `You want to ${
                      record.status === Enum.LearnerAccountStatus.ACTIVE
                        ? "revoke"
                        : "release"
                    } access for this learner`,
                    onOk() {
                      changeAccountStatus(
                        {
                          id: record._id,
                          status:
                            record.status === Enum.LearnerAccountStatus.ACTIVE
                              ? Enum.LearnerAccountStatus.INACTIVE
                              : Enum.LearnerAccountStatus.ACTIVE,
                        },
                        {
                          onSuccess: () => {
                            message.open({
                              type: "success",
                              content: "Learned status updated successfully",
                            });
                          },
                        }
                      );
                    },
                    okText:
                      record.status === Enum.LearnerAccountStatus.ACTIVE
                        ? "Revoke"
                        : "Give access",
                  });
                },
              },
              {
                label: "Remove Learner",
                key: "remove",
                icon: <DeleteOutlined />,
                onClick: () => {
                  confirm({
                    title: `Are you sure? You want to remove ${
                      record.name || record.email
                    }`,
                    // icon: <ExclamationCircleOutlined />,
                    content: `Learner will no longer have any access to the platform`,
                    onOk() {
                      deleteLearner(record._id, {
                        onSuccess: () => {
                          message.open({
                            type: "success",
                            content: "Learner deleted successfully",
                          });
                        },
                      });
                    },
                    okText: "Revoke access",
                  });
                },
              },
            ]}
          />
        )}
      />
    </Table>
  );
}

export default LearnersTable;
