import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Form,
  List,
  Modal,
  Row,
  Select,
  Skeleton,
  Space,
  Switch,
  Tabs,
  Tag,
} from "antd";
import {
  BarChartOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  LineChartOutlined,
  PrinterOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Constants, Enum, Types, Utils } from "@adewaskar/lms-common";
import Table, { TableColumn } from "@Components/Table/TableComponent";

import { Fragment, useState } from "react";
import MoreButton from "@Components/MoreButton";
import PrintPrompt from "../TestCreator/TestBuilder/PrintPrompt";
import TestCard from "./TestCard";
import TestStatusTag from "./TestStatus";
import { Typography } from "@Components/Typography";
import { User } from "@adewaskar/lms-common";
import dayjs from "dayjs";
import { useModal } from "@Components/ActionModal/ModalContext";
import { NavLink, useNavigate } from "@Router/index";

const { Text } = Typography;

function TestsList(props: { filter: Types.GetTestsFilter }) {
  const navigate = useNavigate();
  const { data: categories } = User.Queries.useGetProductCategories("all");
  const { data: users } = User.Queries.useGetUsers();
  const { openModal } = useModal();
  const { data, isFetching: loading } = User.Queries.useGetTests(
    // props.filter
    props.filter
    // {
    //   // @ts-ignore
    //   enabled: !!props.filter.category
    // }
  );
  // const filteredData=data.filter(pd => {
  //   return !pd.endedAt;
  // })
  const { mutate: publishTest, isLoading: publishingTest } =
    User.Queries.usePublishTest();

  const { mutate: deleteTest, isLoading: deletingTest } =
    User.Queries.useDeleteTest();
  const { mutate: formatTestSolution, isLoading: formattingTestSolution } = User.Queries.useFormatTestSolution()

  const ITEMS = (test: Types.Test) => {
    const i = [
      {
        label: "Open Test Builder",
        key: "test-builder",
        icon: <SettingOutlined />,
        onClick: () => {
          window.open(`/admin/products/test/${test._id}/builder`);
        },
      },
      {
        label: "Show Analysis",
        key: "show-analysis",
        icon: <LineChartOutlined />,
        onClick: () => {
          navigate(`/admin/products/test/${test._id}/status`);
        },
      },
      {
        label: "Print Action",
        key: "print",
        icon: <PrinterOutlined />,
        onClick: () => {
          openModal(<PrintPrompt testId={test._id + ""} />, {
            title: "Print",
          });
        },
      },
      {
        label: "Format Test Solution",
        key: "format-test",
        icon: <SettingOutlined />,
        onClick: () => {
          formatTestSolution({ testId: test._id })
        },
      },
      {
        label: "Upload Answer Sheets",
        key: "upload-answer-sheet",
        icon: <UploadOutlined />,
        onClick: () => {
          window.open(`/admin/test/${test._id}/answer-sheet/upload`);
        },
      },
      {
        label: "Delete Test",
        key: "delete-test",
        icon: <DeleteOutlined />,
        onClick: () => {
          Modal.confirm({
            title: `Are you sure?`,
            // icon: <ExclamationCircleOutlined />,
            content: `You want to delete this test`,
            onOk() {
              deleteTest({
                testId: test._id + "",
              });
            },
            okText: "Yes, Delete",
          });
        },
      },
    ];
    if (test._id && test.status !== Enum.TestStatus.PUBLISHED) {
      i.unshift({
        label: "Publish Test",
        key: "publish-test",
        icon: <UploadOutlined />,
        onClick: () => {
          publishTest({
            testId: test._id + "",
          });
        },
      });
    }
    return i;
  };
  const [isPYQ, setIsPYQ] = useState(false);
  const [isAITraining, setIsAITraining] = useState(false)
  return (
    <Fragment>
      <Fragment>
        <Table
          searchFields={["title", "slug", '_id']}
          loading={loading || deletingTest}
          dataSource={data.filter(
            (test) =>
              props.filter.status.includes(test.status) &&
              (isPYQ ? test?.pyq?.enabled === true : true) &&
              (isAITraining ? (test?.aiTraining?.enabled) === true : true)
          )}
          extra={[
            <Form.Item label="Previous Year Questions">
              <Switch
                checked={!!isPYQ}
                onChange={(e) => {
                  setIsPYQ(e);
                }}
              />
            </Form.Item>,
            <Form.Item label="AI Training">
              <Switch
                checked={!!isPYQ}
                onChange={(e) => {
                  setIsAITraining(e);
                }}
              />
            </Form.Item>,
          ]}
        >
          <TableColumn
            fixed
            title="Title"
            dataIndex="title"
            key="title"
            render={(_: any, test: Types.Test) => (
              <NavLink to={`/admin/products/test/${test._id}/editor`}>
                {test.title}
              </NavLink>
            )}
          />
          <TableColumn
            title="Exam"
            dataIndex="exam"
            key="exam"
            // @ts-ignore
            render={(_: any, test: Types.Test) => {
              const cat = categories.find((c) => c._id == test.category);
              return cat?.title;
            }}
            onFilter={(value, record) => record.category === value}
            filters={categories.map((l) => {
              return {
                text: l.title,
                value: l._id,
              };
            })}
          />
          <TableColumn
            fixed
            title="Languages"
            onFilter={(value, record) =>
              record.languages.indexOf(value as string) === 0
            }
            filters={Constants.LANGUAGES.map((l) => {
              return {
                text: l.label,
                value: l.value,
              };
            })}
            // sorter={(a, b) => a.languages[0] - b.languages[0]}
            dataIndex="language"
            key="language"
            render={(_: any, test: Types.Test) => (
              <>
                {test.languages
                  .map(
                    (l) =>
                      Constants.LANGUAGES.find((lg) => lg.value === l)?.label
                  )
                  .join(", ")}
              </>
            )}
          />
          <TableColumn
            title="Questions"
            dataIndex="slug"
            key="slug"
            render={(_: any, test: Types.Test) => test.sections.map(i => i.items).flat().length}
          />
          <TableColumn
            title="Promoted"
            dataIndex="slug"
            key="slug"
            render={(_: any, test: Types.Test) =>
              test?.promotion?.enabled ? (
                <Tag color="purple">Promoted</Tag>
              ) : (
                "-"
              )
            }
          />
          <TableColumn
            // defaultSortOrder={"ascend"}
            sorter={(a, b) => a.isTopicsAssigned - b.isTopicsAssigned}
            title="Topics Assigned"
            dataIndex="topicsAssigned"
            key="topicsAssigned"
            fixed
            // @ts-ignore
            render={(_: any, test: Types.Test) =>
              // @ts-ignore
              test.isTopicsAssigned ? (
                <Tag color="green">Assigned</Tag>
              ) : (
                <Tag color="red">Pending</Tag>
              )
            }
          />
          <TableColumn
            title="Last Updated By"
            dataIndex="updatedBy"
            key="updatedBy"
            // @ts-ignore
            render={(_: any, test: Types.Test) => {
              const user: Types.User =
                users.find((c) => c._id == test.updatedBy) ||
                Constants.INITIAL_USER_DETAILS;
              if (
                user?.status === Enum.UserAccountStatus.INACTIVE ||
                user?.status === Enum.UserAccountStatus.DELETED
              ) {
                return `${user.name
                  } [${Enum.UserAccountStatus.DELETED.toUpperCase()}]`;
              }
              return user.name || "-";
            }}
          />
          <TableColumn
            title="Duration"
            dataIndex="duration"
            key="duration"
            // @ts-ignore
            render={(_: any, test: Types.Test) =>
              test.duration.enabled ? (
                <Tag color="blue-inverse">{test.duration.value} mins</Tag>
              ) : (
                "-"
              )
            }
          />
          <TableColumn
            title="URL Slug"
            dataIndex="slug"
            key="slug"
            // @ts-ignore
            render={(_: any, test: Types.Test) => test.slug || "-"}
          />

          <TableColumn
            title="Last Updated"
            dataIndex="lastUpdated"
            key="lastUpdated"
            render={(_: any, test: Types.Test) =>
              // @ts-ignore
              dayjs(test.updatedAt).format("LLL")
            }
          />
          <TableColumn
            title="Status"
            dataIndex="status"
            // defaultSortOrder={"ascend"}
            sorter={(a, b) => a.status - b.status}
            key="status"
            onFilter={(value, record) =>
              record.status.indexOf(value as string) === 0
            }
            filters={[
              {
                text: Enum.TestStatus.DRAFT,
                value: Enum.TestStatus.DRAFT,
              },
              {
                text: Enum.TestStatus.PUBLISHED,
                value: Enum.TestStatus.PUBLISHED,
              },
              {
                text: Enum.TestStatus.ENDED,
                value: Enum.TestStatus.ENDED,
              },
              {
                text: Enum.TestStatus.IN_PROGRESS,
                value: Enum.TestStatus.IN_PROGRESS,
              },
            ]}
            // @ts-ignore
            render={(_: any, test: Types.Test) => <TestStatusTag test={test} />}
          />
          <TableColumn
            fixed
            title="Action"
            key="action"
            render={(_: any, test: Types.Test, index: number) => (
              <MoreButton items={ITEMS(test)} />
            )}
          />
        </Table>
      </Fragment>
    </Fragment>
  );
}
export default TestsList;

const SkeletonCard = () => (
  <Card>
    <Skeleton active paragraph />
    <Row justify={"space-between"}>
      <Col>
        <Skeleton.Button style={{ marginTop: 20 }} block />
      </Col>
      <Col>
        <Skeleton.Button style={{ marginTop: 20 }} block />
      </Col>
      <Col>
        <Skeleton.Button style={{ marginTop: 20 }} block />
      </Col>
    </Row>{" "}
  </Card>
);
