import { Button, Modal, Rate, Space } from "antd";
import { Enum, Types } from "@adewaskar/lms-common";
import Table, { TableColumn } from "@Components/Table/TableComponent";

import ActionModal from "@Components/ActionModal/ActionModal";
import Container from "@Components/Container";

import { User } from "@adewaskar/lms-common";
import { capitalize, sortBy } from "lodash";
import dayjs from "dayjs";
import EnrollLearner from "@User/Screens/Tests/TestCreator/TestLearners/EnrolLearner";
import MoreButton from "@Components/MoreButton";

const { confirm } = Modal;
interface PackageLearnersPropsI {
  packageId: string;
}

function PackageLearners(props: PackageLearnersPropsI) {
  const { data, isLoading: loading } =
    User.Queries.useGetEnrolledProductLearners(props.packageId + "");
  const { mutate: removeEnrollment, isLoading: removingEnrollment } =
    User.Queries.useRemoveEnrollmentOfLearner(props.packageId + "");

  return (
    <Container
      title="Enrolled Learners"
      extra={[
        <ActionModal
          title={`Enroll Learner`}
          cta={<Button>Add Learner</Button>}
        >
          <EnrollLearner
            product={{ type: Enum.ProductType.TEST, id: props.packageId }}
          />
        </ActionModal>,
      ]}
    >
      <Table
        searchFields={["learner.name", "learner.contactNo", "learner.email"]}
        // @ts-ignore
        dataSource={sortBy(data, "-metadata.package.endedAt")}
        loading={loading}
      >
        <TableColumn
          title="Name"
          dataIndex="name"
          render={(_: any, record: Types.EnrolledProductDetails) =>
            // @ts-ignore
            record.learner.name ? capitalize(record.learner.name) : "-"
          }
        />
        <TableColumn
          title="Enrolled At"
          dataIndex="email"
          key="email"
          render={(_: any, record: Types.EnrolledProductDetails) => (
            <Space size="middle">
              {dayjs(record.enrolledAt).format("LLL")}
            </Space>
          )}
        />
        <TableColumn
          title="Email"
          dataIndex="learner.email"
          key="learner.email"
          render={(_: any, record: Types.EnrolledProductDetails) =>
            // @ts-ignore
            record.learner.email || "-"
          }
        />
        {/* <TableColumn
title="Last Login"
dataIndex="lastActive"
key="lastActive"
render={(_: any, record: Types.Learner) => (
  <Space size="middle">{dayjs(record.lastActive).format('LLLL')}</Space>
)}
/>
<TableColumn
title="Joined On"
dataIndex="createdAt"
key="createdAt"
render={(_: any, record: Types.Learner) => (
  <Space size="middle">{dayjs(record.createdAt).format('LL')}</Space>
)}
/> */}
        {/* <TableColumn
          title="Submitted At"
          dataIndex="email"
          key="email"
          render={(_: any, record: Types.EnrolledProductDetails) =>
            record.metadata.package.endedAt ? (
              <Space size="middle">
                {dayjs(record.metadata.package.endedAt).format("LLL")}
              </Space>
            ) : (
              "-"
            )
          }
        /> */}
        <TableColumn
          title="Rating"
          dataIndex="rating"
          key="rating"
          render={(_: any, record: Types.EnrolledProductDetails) => {
            const review = record?.review as unknown as Types.ProductReview;
            return review?.rating ? (
              <Rate disabled allowHalf defaultValue={review?.rating} />
            ) : (
              "-"
            );
          }}
        />
        <TableColumn
          title="Rating Comment"
          dataIndex="createdAt"
          key="createdAt"
          render={(_: any, record: Types.EnrolledProductDetails) => {
            const review = record?.review as unknown as Types.ProductReview;
            return review?.comment ? (
              <Space size="middle">{review?.comment}</Space>
            ) : (
              "-"
            );
          }}
        />
        <TableColumn
          title="Action"
          key="action"
          render={(_: any, record: Types.EnrolledProductDetails) => {
            return (
              <MoreButton
                items={[
                  {
                    label: "Refund",
                    key: "refund",
                    // onClick: () => {
                    //   confirm({
                    //     title: "Are you sure?",
                    //     // icon: <ExclamationCircleOutlined />,
                    //     content: `You want to refund this package to the user`,
                    //     onOk() {
                    //       removeEnrollment({
                    //         // @ts-ignore
                    //         learnerId: record.learner._id,
                    //       });
                    //     },
                    //     okText: "Initiate Refund",
                    //   });
                    // },
                  },
                  {
                    label: "Remove Enmrollment",
                    key: "remove",
                    onClick: () => {
                      confirm({
                        title: "Are you sure?",
                        // icon: <ExclamationCircleOutlined />,
                        content: `You want to delete enrollment for this user`,
                        onOk() {
                          removeEnrollment({
                            // @ts-ignore
                            learnerId: record.learner._id,
                          });
                        },
                        okText: "Initiate Refund",
                      });
                    },
                  },
                ]}
              />
            );
          }}
        />
      </Table>
    </Container>
  );
}

export default PackageLearners;
