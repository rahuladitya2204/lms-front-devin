import {
  Avatar,
  Button,
  Card,
  Col,
  Modal,
  Rate,
  Row,
  Space,
  Tag,
  message,
} from "antd";
import {
  BookOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Enum, Types, Constants } from "@adewaskar/lms-common";
import Table, { TableColumn } from "@Components/Table/TableComponent";

import MoreButton from "@Components/MoreButton";
import { User } from "@adewaskar/lms-common";
import dayjs from "dayjs";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";
import { sortBy } from "lodash";
import UTMSourceTag from "../Learners/UTMSourceTag";
import AddAffiliate from "./AddAffiliate";
import { AffiliatePayoutDetails } from "./AffiliatesScreen";

const confirm = Modal.confirm;

function AffiliatesTable() {
  const { data, isFetching: loading } = User.Queries.useGetAffiliates();
  const { mutate: deleteAffiliate, isLoading: deletingAffiliate } =
    User.Queries.useDeleteAffiliate();

  const { mutate: verifyAffiliateBankDetails, isLoading: verifyingAffiliate } =
    User.Queries.useVerifyAffiliateBankDetails();

  const { mutate: changeAccountStatus } =
    User.Queries.useUpdateAffiliateAccountStatus();
  const { openModal } = useModal();
  return (
    <Table
      searchFields={[
        "name",
        "learner.email",
        "learner.contactNo",
        "_id",
        "learner._id",
      ]}
      dataSource={sortBy(data, ["-lastActive"])}
      loading={loading || deletingAffiliate || verifyAffiliateBankDetails}
    >
      <TableColumn
        title="Name"
        render={(_: any, record: Types.Affiliate) => record.learner.name || "-"}
        dataIndex="name"
        key="name"
      />

      <TableColumn
        title="Profile Status"
        dataIndex="status"
        key="status"
        render={(_: any, record: Types.Affiliate) =>
          record.status === "active" ? (
            <Tag color="green-inverse">Active</Tag>
          ) : (
            <Tag color="red-inverse">Inactive</Tag>
          )
        }
      />

      <TableColumn
        title="Email"
        dataIndex="learner.email"
        key="learner.email"
        render={(_: any, record: Types.Affiliate) =>
          record.learner.email || "-"
        }
      />
      <TableColumn
        title="Contact No"
        dataIndex="learner.contactNo"
        key="learner.contactNo"
        render={(_: any, record: Types.Affiliate) =>
          record.learner.contactNo || "-"
        }
      />
      {/* <TableColumn
        title="UTM Source"
        render={(_: any, record: Types.Affiliate) => (
          <UTMSourceTag utmSource={record.utmSource} />
        )}
      /> */}
      {/* <TableColumn
        title="Interests"
        render={(_: any, record: Types.Affiliate) =>
          record.interests
            .map((i) => categories.find((c) => c._id === i.id)?.title)
            .filter((i) => i)
            .join(", ") || "-"
        }
      /> */}

      <TableColumn
        title="Bank Account Status"
        dataIndex="status"
        key="status"
        render={(_: any, record: Types.Affiliate) =>
          record.bankDetails.status === "incomplete" ? (
            <Tag color="red-inverse">Incomplete</Tag>
          ) : record.bankDetails.status === "pending" ? (
            <Tag color="yellow-inverse">Pending</Tag>
          ) : record.bankDetails.status === "verification_pending" ? (
            <Tag color="orange-inverse">Verification Pending</Tag>
          ) : (
            <Tag color="green-inverse">Verified</Tag>
          )
        }
      />

      <TableColumn
        title="Joined On"
        dataIndex="createdAt"
        key="createdAt"
        render={(_: any, record: Types.Affiliate) => (
          <Space size="middle">{dayjs(record.createdAt).format("LLLL")}</Space>
        )}
      />
      <TableColumn
        title="Action"
        key="action"
        render={(_: any, record: Types.Affiliate) => (
          <MoreButton
            items={[
              {
                label: "Edit Affiliate",
                icon: <EditOutlined />,
                key: "edit-learner",
                onClick: () => {
                  openModal(
                    <AddAffiliate
                      learnerId={record.learner._id}
                      data={record}
                    />
                  );
                },
              },
              {
                label:
                  record.status === Enum.AffiliateAccountStatus.ACTIVE
                    ? "Revoke Access"
                    : "Release Access",
                key: "change-status",
                icon: <CloseOutlined />,
                onClick: () => {
                  confirm({
                    title: "Are you sure?",
                    // icon: <ExclamationCircleOutlined />,
                    content: `You want to ${record.status === Enum.AffiliateAccountStatus.ACTIVE
                        ? "revoke"
                        : "release"
                      } access for this learner`,
                    onOk() {
                      changeAccountStatus(
                        {
                          id: record._id,
                          status:
                            record.status === Enum.AffiliateAccountStatus.ACTIVE
                              ? Enum.AffiliateAccountStatus.INACTIVE
                              : Enum.AffiliateAccountStatus.ACTIVE,
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
                      record.status === Enum.AffiliateAccountStatus.ACTIVE
                        ? "Revoke"
                        : "Give access",
                  });
                },
              },
              {
                label: "Verify Bank Details",
                key: "verify-bank-details",
                icon: <CheckCircleOutlined />,
                onClick: () => {
                  verifyAffiliateBankDetails(
                    { learnerId: record.learner._id },
                    {
                      onSuccess: () => {
                        message.open({
                          type: "success",
                          content: "Bank details verified successfully",
                        });
                      },
                    }
                  );
                },
              },
              {
                label: "View Payout Details",
                key: "view-payout-details",
                icon: <BookOutlined />,
                onClick: () => {
                  openModal(
                    <AffiliatePayoutDetails affiliateId={record._id} />,
                    {
                      width: 800,
                    }
                  );
                },
              },
              {
                label: "Remove Affiliate",
                key: "remove",
                icon: <DeleteOutlined />,
                onClick: () => {
                  confirm({
                    title: `Are you sure? You want to remove ${record.learner.name || record.learner.email
                      }`,
                    // icon: <ExclamationCircleOutlined />,
                    content: `Affiliate will no longer have any access to the platform`,
                    onOk() {
                      deleteAffiliate(record._id, {
                        onSuccess: () => {
                          message.open({
                            type: "success",
                            content: "Affiliate deleted successfully",
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

export default AffiliatesTable;

// export const EnrolledProductsOfAffiliate = (props: { learnerId: string }) => {
//   const { data: enrolledProducts, isLoading } =
//     User.Queries.useGetEnrolledProductsOfAffiliate(props.learnerId);
//   return (
//     <>
//       <Table
//         loading={isLoading}
//         dataSource={sortBy(enrolledProducts, ["-metadata.test.endedAt"])}
//       >
//         <TableColumn
//           title="Title"
//           render={(_: any, record: Types.EnrolledProductDetails) =>
//             record.product.data.title ? (
//               <>
//                 <Avatar src={record.product.data.thumbnailImage} />{" "}
//                 {record.product.data.title}
//               </>
//             ) : (
//               "-"
//             )
//           }
//           dataIndex="title"
//           key="title"
//         />

//         <TableColumn
//           title="Enrolled At"
//           render={(_: any, record: Types.EnrolledProductDetails) =>
//             dayjs(record.enrolledAt).format("LLL")
//           }
//           dataIndex="enrolledAt"
//           key="enrolledAt"
//         />

//         <TableColumn
//           title="Started At"
//           render={(_: any, record: Types.EnrolledProductDetails) =>
//             record.metadata.test.startedAt
//               ? dayjs(record.metadata.test.startedAt).format("LLL")
//               : "-"
//           }
//           dataIndex="startedAt"
//           key="startedAT"
//         />

//         <TableColumn
//           title="Ended At"
//           render={(_: any, record: Types.EnrolledProductDetails) =>
//             record.metadata.test.endedAt
//               ? dayjs(record.metadata.test.endedAt).format("LLL")
//               : "-"
//           }
//           dataIndex="endedAt"
//           key="endedAt"
//         />
//         {/* <TableColumn
//           title="Rating"
//           render={(_: any, record: Types.EnrolledProductDetails) =>
//             record.review ? (
//               <Rate
//                 style={{ fontSize: 12 }}
//                 disabled
//                 value={record.review?.rating}
//               />
//             ) : (
//               "-"
//             )
//           }
//           dataIndex="endedAt"
//           key="endedAt"
//         /> */}
//       </Table>
//     </>
//   );
// };
