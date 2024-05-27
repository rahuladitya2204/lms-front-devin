import { Button, Modal, Rate, Space } from "antd";
import { Enum, Types } from "@adewaskar/lms-common";
import Table, { TableColumn } from "@Components/Table/TableComponent";

import ActionModal from "@Components/ActionModal/ActionModal";
import Container from "@Components/Container";
import EnrollLearner from "./EnrolLearner";
import { User } from "@adewaskar/lms-common";
import { capitalize, sortBy } from "lodash";
import dayjs from "dayjs";

import * as React from "react";

const { confirm } = Modal;
interface TestLearnersPropsI {
  testId: string;
}

function TestEnrolledLearners(props: TestLearnersPropsI) {
  const { data, isLoading: loading } =
    User.Queries.useGetEnrolledProductLearners(props.testId + "");

  // const { mutate: removeLearnerFromTest } =
  //   User.Queries.useRemoveLearnerFromCourse();

  return (
    <Container
      title="Enrolled Learners"
      extra={[
        <ActionModal
          title={`Enroll Learner`}
          cta={<Button>Add Learner</Button>}
        >
          <EnrollLearner
            product={{ type: Enum.ProductType.TEST, id: props.testId }}
          />
        </ActionModal>,
      ]}
    >
      <Table
        searchFields={["learner.name", "learner.contactNo", "learner.email"]}
        // @ts-ignore
        dataSource={sortBy(data, "-metadata.test.endedAt")}
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
        <TableColumn
          title="Submitted At"
          dataIndex="email"
          key="email"
          render={(_: any, record: Types.EnrolledProductDetails) =>
            record.metadata.test.endedAt ? (
              <Space size="middle">
                {dayjs(record.metadata.test.endedAt).format("LLL")}
              </Space>
            ) : (
              "-"
            )
          }
        />
        {/* <TableColumn
          title="Action"
          key="action"
          render={(_: any, record: Types.EnrolledProductDetails) => {
            return (
              <Space>
                <Button
                  onClick={() => {
                    confirm({
                      title: "Are you sure?",
                      // icon: <ExclamationCircleOutlined />,
                      content: `You want to refund this test to the user`,
                      onOk() {
                        removeLearnerFromTest({
                          courseId: props.testId,
                          // @ts-ignore
                          learnerId: record.learner._id,
                        });
                      },
                      okText: "Initiate Refund",
                    });
                  }}
                  size="small"
                  type="primary"
                >
                  Refund
                </Button>
              </Space>
            );
          }}
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
      </Table>
    </Container>
  );
}

// export const TestLearnerOrders = (props: TestLearnersPropsI) => {
//   const { data: orders, isLoading: loadingOrders } =
//     User.Queries.useGetProductOrders({
//       type: Enum.ProductType.TEST,
//       id: props.testId,
//     });
//   return (
//     <Container
//       title="Enrolled Learners"
//       extra={[
//         <ActionModal
//           title={`Learner Orders`}
//           cta={<Button>Add Learner</Button>}
//         >
//           <EnrollLearner
//             product={{ type: Enum.ProductType.TEST, id: props.testId }}
//           />
//         </ActionModal>,
//       ]}
//     >
//       <Table
//         searchFields={["learner.name", "learner.contactNo", "learner.email"]}
//         // @ts-ignore
//         dataSource={sortBy(orders, "-metadata.test.endedAt")}
//         loading={loadingOrders}
//       >
//         <TableColumn
//           title="Name"
//           dataIndex="name"
//           render={(_: any, record: Types.EnrolledProductDetails) =>
//             // @ts-ignore
//             record.learner.name ? capitalize(record.learner.name) : "-"
//           }
//         />
//         <TableColumn
//           title="Offline Kit Status"
//           dataIndex="offlineKit.status"
//           key="offlineKit.status"
//           render={(_: any, record: Types.Order) => (
//             <Space size="middle">
//               {record?.offlineKit?.delivery?.status || "-"}
//             </Space>
//           )}
//         />
//       </Table>
//     </Container>
//   );
// };

// const TestL = React.memo((props: { testId: string }) => {
//   return (
//     <Tabs
//       items={[
//         {
//           label: "Enrolled Learners",
//           key: "enrolled-learners",
//           children: <TestEnrolledLearners testId={props.testId} />,
//         },
//         {
//           label: "Orders",
//           key: "learner orders",
//           children: <TestLearnerOrders testId={props.testId} />,
//         },
//       ]}
//     />
//   );
// });

// export default TestL;

export default TestEnrolledLearners;
