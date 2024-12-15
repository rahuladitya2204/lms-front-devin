import {
  Button,
  Card,
  Col,
  Dropdown,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Upload,
  message,
} from "antd";
import { Types, User } from "@adewaskar/lms-common";

import ActionModal from "@Components/ActionModal/ActionModal";
import AudioPlayer from "@Components/AudioPlayer";
import Header from "@Components/Header";
import MoreButton from "@Components/MoreButton";
import NewsDetailScreen from "./NewsDetailScreen";
import NewsStatusTag from "./NewsStatusTag";
import { NotificationOutlined } from "@ant-design/icons";
import React from "react";
// import PDFViewer from '@Components/PDFViewer'
import UploadNews from "./UploadNews";
import dayjs from "dayjs";
import useMessage from "@Hooks/useMessage";
import { useModal } from "@Components/ActionModal/ModalContext";

const PDFViewer = React.lazy(() => import("@Components/PDFViewer"));
const { confirm } = Modal;

export default function NewsScreen() {
  const { mutate: summarizeNews, isLoading: summarizing } =
    User.Queries.useSummarizeNews();

  const { mutate: notifyUsers, isLoading: notifying } =
    User.Queries.useNotifyNews();

  const { data, isLoading: loadingNews } = User.Queries.useGetNews();
  const { mutate: deleteNews, isLoading: deletingNews } =
    User.Queries.useDeleteNews();
  const { openModal } = useModal();
  // console.log(data, "ddd");
  return (
    <Header
      title="News"
      extra={
        <ActionModal
          title="Upload News Paper"
          cta={<Button>Upload News</Button>}
        >
          <UploadNews />
        </ActionModal>
      }
    >
      <Row>
        <Col span={24}>
          <Card>
            {" "}
            <Spin spinning={loadingNews || deletingNews}>
              {/* @ts-ignore */}
              <Table dataSource={data}>
                <Table.Column
                  title="Date"
                  dataIndex="date"
                  key="date"
                  render={(_: any, record: Types.News) => (
                    <Space size="middle">
                      {dayjs(record.date).format("LL")}
                    </Space>
                  )}
                />
                <Table.Column
                  title="View PDF"
                  dataIndex="pdf"
                  key="pdf"
                  render={(_: any, record: Types.News) => (
                    <MoreButton
                      items={record.files.map(({ url, file }, index) => {
                        return {
                          label: `View PDF: ${index + 1}`,
                          key: file,
                          onClick: () => {
                            openModal(<PDFViewer file={{ _id: file }} />, {
                              width: 700,
                              lazy: true,
                              title: `News Paper: ${dayjs(record.date).format(
                                "LL"
                              )}`,
                            });
                          },
                        };
                      })}
                    />
                  )}
                />
                <Table.Column
                  title="Status"
                  dataIndex="status"
                  key="status"
                  render={(_: any, record: Types.News) => (
                    // @ts-ignore
                    <NewsStatusTag status={record.status} />
                  )}
                />
                {/* <Table.Column
                  title="Audio"
                  dataIndex="audio"
                  key="audio"
                  render={(_: any, record: Types.News) =>
                    record?.audio?.url ? (
                      <AudioPlayer src={record.audio.url} />
                    ) : (
                      'No Audio Found'
                    )
                  }
                /> */}
                <Table.Column
                  title="Action"
                  key="action"
                  render={(_: any, record: Types.News, index: number) => (
                    <MoreButton
                      items={[
                        {
                          label: "Notify Everyone",
                          key: "notify",
                          icon: <NotificationOutlined />,
                          onClick: () => {
                            if (record?.audio?.url) {
                              confirm({
                                title: "Are you sure to notify everyone?",
                                // icon: <ExclamationCircleOutlined />,
                                content: `Please listen to the audio once, only then send it`,
                                onOk() {
                                  notifyUsers(
                                    {
                                      id: record._id + "",
                                    },
                                    {
                                      onSuccess: () => {
                                        message.open({
                                          type: "success",
                                          content: "Notifications Sent",
                                        });
                                      },
                                    }
                                  );
                                },
                                okText: "Yes, Notify",
                              });
                            } else {
                              message.open({
                                type: "error",
                                content: "No Audio Found, Please refresh page",
                              });
                            }
                          },
                        },

                        {
                          label: "Generate Summary",
                          onClick: () =>
                            summarizeNews(
                              { id: record._id + "" },
                              {
                                onSuccess: () => {
                                  message.open({
                                    type: "success",
                                    content: "Summaring Initiated",
                                  });
                                },
                              }
                            ),
                          key: "summarize",
                        },
                        {
                          label: "View Summary",
                          onClick: () =>
                            openModal(<NewsDetailScreen data={record} />, {
                              title: `${dayjs(record.date).format("LL")} news`,
                              width: 700,
                            }),
                          key: "view",
                        },
                        {
                          label: "Delete News",
                          onClick: () => {
                            confirm({
                              title: `Are you sure?`,
                              // icon: <ExclamationCircleOutlined />,
                              content: `You want to delete this news`,
                              onOk() {
                                deleteNews(
                                  {
                                    id: record._id + "",
                                  },
                                  {
                                    onSuccess: () => {
                                      message.open({
                                        type: "success",
                                        content: "News Delete Successfully",
                                      });
                                    },
                                  }
                                );
                              },
                              okText: "Delete",
                            });
                          },
                          key: "delete",
                        },
                        // {
                        //   label: 'Edit Category',
                        //   onClick: () =>
                        //     openModal(<UploadNews data={record} />, {
                        //       title: 'Edit Category'
                        //     }),
                        //   key: 'edit'
                        // }
                      ]}
                    />
                  )}
                />
              </Table>
            </Spin>
          </Card>
        </Col>
      </Row>
    </Header>
  );
}
