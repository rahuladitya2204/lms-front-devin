import AppImage from "@Components/Image";
import Table, { TableColumn } from "@Components/Table/TableComponent";
import { Title } from "@Components/Typography/Typography";
import { Types, User } from "@adewaskar/lms-common";
import { Col, Divider, Image, Row, Space, Spin } from "antd";
import dayjs from "dayjs";

export default function UserLogs({ id }: { id: string }) {
  const { data: userLog, isLoading } = User.Queries.useGetUserLog(id);
  // console.log(userLog, "userLog");
  return (
    <Spin spinning={isLoading}>
      <Row>
        {userLog._id ? (
          <Col span={24}>
            <Title level={5}>
              Started At: {dayjs(userLog.startedAt).format("LLL")}
            </Title>
            <Title level={5}>
              Last Updated At: {dayjs(userLog.lastUpdate).format("LLL")}
            </Title>
            {userLog.idleTime ? (
              <Title level={5}>IDLE Time: {userLog.idleTime} mins</Title>
            ) : null}
            <Title level={5}>
              Total Time Logged:{" "}
              {formatDuration(userLog.startedAt, userLog.lastUpdate)}
            </Title>
          </Col>
        ) : null}
        <Col span={24}>
          <Image.PreviewGroup>
            <Table dataSource={userLog.screenshots}>
              <TableColumn
                render={(
                  _: any,
                  record: { date: string; message: string; url: string }
                ) => (
                  <Space size="middle">
                    {dayjs(record.date).format("LLL")}
                  </Space>
                )}
              />

              <TableColumn
                render={(
                  _: any,
                  record: { date: string; message: string; url: string }
                ) => record.message}
              />

              <TableColumn
                render={(
                  _: any,
                  record: { date: string; message: string; url: string }
                ) => <Image preview width={50} height={50} src={record.url} />}
              />
            </Table>
          </Image.PreviewGroup>
        </Col>
      </Row>
    </Spin>
  );
}

const formatDuration = (startedAt: string, lastUpdate: string) => {
  const duration = dayjs(lastUpdate).diff(dayjs(startedAt));
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};
