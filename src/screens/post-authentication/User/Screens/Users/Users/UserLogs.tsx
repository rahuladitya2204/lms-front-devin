import AppImage from "@Components/Image";
import Table, { TableColumn } from "@Components/Table/TableComponent";
import Tabs from "@Components/Tabs";
import { Title } from "@Components/Typography/Typography";
import { Store, Types, User } from "@adewaskar/lms-common";
import { Col, DatePicker, Divider, Image, Row, Space, Spin } from "antd";
import dayjs from "dayjs";
import { sortBy } from "lodash";
import { useState } from "react";
import UserLogDates from "./UserLogsDates";

export function UserLogs({ user }: { user: Types.User }) {
  const [date, setDate] = useState(dayjs());
  const { data: userLog, isLoading } = User.Queries.useGetUserLog(
    user,
    date?.toISOString()
  );
  const screenshots = sortBy(userLog.screenshots, ["-date"]);
  return (
    <Spin spinning={isLoading}>
      <Row>
        <Col span={24}>
          <DatePicker value={date} onChange={(e) => setDate(e)} />
        </Col>
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
            <Table dataSource={screenshots}>
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

export const formatDuration = (startedAt: string, lastUpdate: string) => {
  const duration = dayjs(lastUpdate).diff(dayjs(startedAt));
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};


export default function UserLog({ user }: { user: Types.User }) {
  return <Tabs tabKey="user-logs" items={[
    {
      label: 'Today',
      key: 'today',
      children: <UserLogs user={user} />
    },
    {
      label: 'Till Date',
      key: 'till-date',
      children: <UserLogDates user={user} />
    }
  ]} />
}