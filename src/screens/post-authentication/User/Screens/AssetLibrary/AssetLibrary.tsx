import { Button, Card, Col, Modal, Row, Space, Spin } from "antd";
import { Common, Store, Types, User } from "@adewaskar/lms-common";

import { DeleteOutlined } from "@ant-design/icons";
import FileTypeIcon from "@Components/FileTypeIcon";
import Header from "@User/Screens/UserRoot/UserHeader";
import MoreButton from "@Components/MoreButton";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import { unit } from "mathjs";
import Table, { TableColumn } from "@Components/Table/TableComponent";
import ActionModal from "@Components/ActionModal/ActionModal";
import { sortBy } from "lodash";
import { useMemo } from "react";
import MediaUpload from "@Components/MediaUpload";
import { copyToClipboard } from "@Utils/index";

const { Text } = Typography;

function AssetLibraryScreen() {
  const { data, isFetching: loadingFiles } = Common.Queries.useGetFiles();
  const { data: organisation } = User.Queries.useGetOrgDetails();
  const { mutate: deleteFile, isLoading: deletingFile } =
    Common.Queries.useDeleteFile();
  const { confirm } = Modal;
  const sortedData = useMemo(
    () => sortBy(data, "-createdAt").reverse(),
    [data]
  );
  return (
    <Header>
      <Card
        extra={[
          <ActionModal cta={<Button>Upload File</Button>}>
            <UploadFileForm />
          </ActionModal>,
        ]}
        bodyStyle={{ padding: 0 }}
        title={`Asset Library - ${Math.ceil(
          unit(organisation.storage.utilised, "byte").to("megabyte").toJSON()
            .value
        )} MB`}
      >
        <Row>
          <Col span={24}>
            <Table
              dataSource={sortedData}
              loading={loadingFiles || deletingFile}
            >
              <TableColumn
                title=""
                dataIndex=""
                render={(_: any, record: { name: string; type: string }) => {
                  const fileType = record.type.split("/")[0];
                  return (
                    <Space size="middle">
                      <Text strong>
                        <FileTypeIcon iconType="outlined" fileType={fileType} />
                      </Text>
                    </Space>
                  );
                }}
              />
              <TableColumn
                title="Name"
                dataIndex="name"
                render={(_: any, record: { name: string; type: string }) => {
                  const name = record.name.split("/")[0];
                  const fileType = record.type.split("/")[0];
                  return (
                    <Space size="middle">
                      <Text strong>{name}</Text>
                    </Space>
                  );
                }}
              />
              <TableColumn
                title="File Type"
                dataIndex="type"
                key="type"
                render={(_: any, record: { type: string }) => {
                  const type = record.type.split("/")[0];
                  return (
                    <Space size="middle">
                      <Text strong>{type}</Text>
                    </Space>
                  );
                }}
              />
              <TableColumn
                title="Size"
                dataIndex="size"
                key="size"
                render={(_: any, record: { size: number }) => {
                  const size = Math.ceil(
                    unit(record.size, "byte").to("megabyte").toJSON().value
                  );
                  return (
                    <Space size="middle">
                      <Text strong>{size} MB</Text>
                    </Space>
                  );
                }}
              />
              <TableColumn
                title="Modified On"
                dataIndex="updatedAt"
                key="updatedAt"
                render={(_: any, record: { updatedAt: string }) => (
                  <Space size="middle">
                    {dayjs(record.updatedAt).format("LLLL")}
                  </Space>
                )}
              />
              <TableColumn
                title="Created On"
                dataIndex="createdAt"
                key="createdAt"
                render={(_: any, record: { createdAt: string }) => (
                  <Space size="middle">
                    {dayjs(record.createdAt).format("LLLL")}
                  </Space>
                )}
              />
              <TableColumn
                title="Created By"
                key="createdBy"
                render={(
                  _: any,
                  record: { createdBy: Types.User; _id: string }
                ) => <Space size="middle">{record?.createdBy?.name}</Space>}
              />
              {/* <TableColumn
                title="Action"
                key="action"
                render={(_: any, record: Types.User) => (
                  <MoreButton
                    items={[
                      {
                        label: 'Delete File',
                        key: 'delete',
                        onClick: () => {
                          confirm({
                            title: 'Are you sure?',
                            // icon: <ExclamationCircleOutlined />,
                            content: `You want to delete this file`,
                            onOk() {
                              deleteFile({ id: record._id })
                            },
                            okText: 'Delete'
                          })
                        }
                      }
                    ]}
                  />
                )}
              /> */}
            </Table>
          </Col>
        </Row>
      </Card>
    </Header>
  );
}

export default AssetLibraryScreen;

export const UploadFileForm = (props: { closeModal?: Function }) => {
  return (
    <Row>
      <Col span={24}>
        <MediaUpload
          uploadType="file"
          cropper={{ width: 330, height: 200 }}
          name={["info", "calendar", "link"]}
          onUpload={(e) => {
            Modal.confirm({
              closable: false,
              title: `File Uploaded`,
              // icon: <ExclamationCircleOutlined />,
              content: `Your file has been uploaded`,
              // footer: [

              // ],
              onOk() {
                copyToClipboard(e.url);
                props?.closeModal();
              },
              okText: "Copy Link",
            });
          }}
        />
      </Col>
    </Row>
  );
};
