import AppImage from "@Components/Image";
import Table, { TableColumn } from "@Components/Table/TableComponent";
import { Title } from "@Components/Typography/Typography";
import { Store, Types, User } from "@adewaskar/lms-common";
import { Col, DatePicker, Divider, Image, Row, Space, Spin } from "antd";
import dayjs from "dayjs";
import { sortBy } from "lodash";
import { useState } from "react";

export default function UserLogDates({ user }: { user: Types.User }) {
    const [date, setDate] = useState([dayjs().startOf('month'), dayjs().endOf('date')]);
    const { data: userLogDates, isLoading } = User.Queries.useGetUserLogForDates(
        user,
        {
            startDate: date[0].toISOString(),
            endDate: date[1].toISOString(),
        }
    );
    return (
        <Spin spinning={isLoading}>
            <Row>
                <Col span={24}>
                    <Table dataSource={userLogDates}>
                        <TableColumn
                            title={`Start Time`}
                            render={(
                                _: any,
                                record: Types.UserLog) => {
                                return dayjs(record.createdAt).format('LLL')
                            }}
                        />

                        <TableColumn
                            title={`End Time`}
                            render={(
                                _: any,
                                record: Types.UserLog) => {
                                return dayjs(record.lastUpdate).format('LLL')
                            }}
                        />

                        <TableColumn
                            title={`Duration`}
                            render={(
                                _: any,
                                record: Types.UserLog) => {
                                return formatDuration(record.createdAt, record.lastUpdate)
                            }}
                        />
                    </Table>
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
