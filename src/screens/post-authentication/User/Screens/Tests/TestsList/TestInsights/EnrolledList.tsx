import {
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  ReloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Col, Modal, Row, Tag, message } from "antd";
import { Enum, Types, User } from "@adewaskar/lms-common";
import React, { useMemo } from "react";
import Table, { TableColumn } from "@Components/Table/TableComponent";
import { useNavigate, useParams } from "@Router/index";

import ActionModal from "@Components/ActionModal/ActionModal";
import AnswerSheetFiles from "@Learner/Screens/Products/Test/TestPlayer/TestPlayerItem/OMR/AnswerSheetFiles";
import EnrollLearner from "../../TestCreator/TestLearners/EnrolLearner";
import MoreButton from "@Components/MoreButton";
import TestStatusTag from "./TestStatusTag";
import { Typography } from "@Components/Typography";
import UploadAnswerSheets from "../../TestCreator/TestBuilder/UploadAnswerSheets";
import dayjs from "dayjs";
import { openWindow } from "@Components/Editor/SunEditor/utils";
import useBreakpoint from "@Hooks/useBreakpoint";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";

const { confirm } = Modal;
const TestAnswerSheet = React.lazy(() => import("./TestAnswerSheet"));

const { Text } = Typography;

const TestEnrolledList = () => {
  const { testId } = useParams();
  const { data: enrolledProducts, isLoading: loadingEp } =
    User.Queries.useGetEnrolledProductLearners(testId + "");
  const { mutate: removeEnrollment, isLoading: removingEnrollment } =
    User.Queries.useRemoveEnrollmentOfLearner(testId + "");
  // console.log(enrolledProducts, 'papa')
  const { openModal } = useModal();
  const { mutate: evaluateLearnerTest } = User.Queries.useEvaluateLearnerTest(
    testId + ""
  );
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  return (
    // @ts-ignore
    <Table
      searchFields={["learner.name", "learner.email", "learner.contactNo"]}
      dataSource={enrolledProducts}
      loading={loadingEp || removingEnrollment}
      extra={[
        <Row gutter={[20, 20]}>
          {/* <Col>
            <Button
              onClick={() =>
              }
              type="primary"
            >
              Upload Sheets
            </Button>
          </Col> */}
          <Col>
            <ActionModal title="Add Learner" cta={<Button>Add Learner</Button>}>
              <EnrollLearner
                product={{ type: Enum.ProductType.TEST, id: testId + "" }}
              />
            </ActionModal>
          </Col>
        </Row>,
      ]}
    >
      {/* <TableColumn
        title="Rank"
        render={(_: any, record: Types.TestLearnerResult, index: number) => (
          // @ts-ignore
          <Title style={{ fontSize: 18 }}>{record.rank}</Title>
        )}
        key="result"
      /> */}
      <TableColumn
        title="Student Name"
        dataIndex="learner.name"
        key="learner.name"
        render={(_: any, record: Types.EnrolledProductDetails) =>
          //   @ts-ignore
          record.learner.name
        }
      />
      {/* <TableColumn
        title="Test Status"
        responsive={['md']}
        dataIndex="learner.name"
        key="learner.name"
      /> */}
      <TableColumn
        title="Test Status"
        responsive={["md"]}
        render={(_: any, record: Types.EnrolledProductDetails) => (
          <TestStatusTag ep={record} />
        )}
        key="result"
      />
      {/* <TableColumn
        title="Time Spent"
        render={(_: any, record: Types.TestLearnerResult) =>
          `${Math.ceil(record?.metrics?.timeSpent / 3600000)} min`
        }
        key="result"
      /> */}
      {/* <TableColumn
        title="Percentile"
        render={(_: any, record: Types.TestLearnerResult) => (
          <Tag color="orange-inverse">{record?.metrics?.percentile}</Tag>
        )}
        key="percentile"
      /> */}
      <TableColumn
        title="Enrolled At"
        responsive={["md"]}
        render={(_: any, record: Types.TestLearnerResult) =>
          // @ts-ignore
          dayjs(record?.enrolledAt).format("LLL")
        }
        key="result"
      />{" "}
      <TableColumn
        title="Action"
        // responsive={['md']}
        key="action"
        render={(_: any, record: any) => {
          return (
            <MoreButton
              items={[
                {
                  label: "Reevaluate Test",
                  icon: <ReloadOutlined />,
                  key: "reevaluate",
                  onClick: () => {
                    evaluateLearnerTest(
                      {
                        learnerId: record.learner._id,
                      },
                      {
                        onSuccess: () => {
                          message.open({
                            type: "success",
                            content: "Evaluation Initiated",
                          });
                        },
                      }
                    );
                  },
                },
                {
                  label: "Upload Answer Sheet",
                  key: "upload-answer-sheet",
                  icon: <UploadOutlined />,
                  onClick: () => {
                    openModal(
                      <AnswerSheetFiles
                        learnerId={record.learner._id}
                        testId={testId}
                        type="user"
                      />,
                      {
                        title: `${record.learner.name}'s answer sheet`,
                      }
                    );
                  },
                },
                {
                  label: "Show Answer Sheet",
                  key: "answer-sheet",
                  icon: <BookOutlined />,
                  onClick: () => {
                    // if (isMobile) {
                    //   openWindow(
                    //     `/admin/test/${testId}/answer-sheet/${record.learner._id}`
                    //   )
                    // } else {
                    openModal(
                      <TestAnswerSheet
                        testId={testId + ""}
                        learnerId={record.learner._id}
                      />,
                      {
                        width: 950,
                        lazy: true,
                        title: `${record.learner.name}'s answer sheet`,
                      }
                    );
                  },
                  // }
                },
                {
                  label: "Delete Enrollment",
                  key: "remove-enrollment",
                  icon: <DeleteOutlined />,
                  onClick: () => {
                    confirm({
                      title:
                        "Are you sure? You want to delete this user's enrollment",
                      // icon: <ExclamationCircleOutlined />,
                      content: `The user will loose access to current enrollment`,
                      onOk() {
                        removeEnrollment({ learnerId: record.learner._id });
                      },
                      okText: "Delete Enrollment",
                    });
                  },
                },
              ]}
            />
          );
        }}
      />
    </Table>
  );
};

export default TestEnrolledList;
