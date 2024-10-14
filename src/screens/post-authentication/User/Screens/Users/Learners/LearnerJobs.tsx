import Table, { TableColumn } from "@Components/Table/TableComponent";
import Tabs from "@Components/Tabs";
import { rangePresets } from "@Screens/post-authentication/Learner/Screens/Affiliate/AffiliateScreen";
import { Types, User } from "@adewaskar/lms-common";
import { Card, DatePicker } from "antd";
import dayjs from "dayjs";
import { capitalize } from "lodash";
import { useState } from "react";

interface LearnerJobsPropsI {
  learnerId: string;
}

export default function LearnerJobs(props: LearnerJobsPropsI) {
  const [dates, setDates] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("day"),
  ]);
  const { data } = User.Queries.useGetLearnerJobs(props.learnerId, dates); // Assuming useGetLearnerJobs accepts a date range
  const statuses = ["pending", "successful", "failed"];

  return (
    <Card
      title="Learner Jobs"
      extra={
        <DatePicker.RangePicker
          presets={rangePresets}
          value={dates}
          onChange={setDates}
        />
      }
    >
      <Tabs
        items={statuses.map((status) => ({
          label: capitalize(status),
          key: status,
          children: <LearnerJobTable data={data[status]} />, // Passing filtered data for each status
        }))}
      />
    </Card>
  );
}

export const LearnerJobTable = ({ data }: { data: Types.AgendaJob[] }) => {
  return (
    <Table dataSource={data} rowKey="jobId">
      {" "}
      {/* Assuming `jobId` is unique */}
      <TableColumn title="Job ID" dataIndex="jobId" key="jobId" />
      <TableColumn title="Learner ID" dataIndex="learnerId" key="learnerId" />
      <TableColumn title="Job Name" dataIndex="jobName" key="jobName" />
      <TableColumn
        title="Status"
        dataIndex="status"
        key="status"
        render={(status) => capitalize(status)}
      />
      <TableColumn
        title="Created At"
        dataIndex="createdAt"
        key="createdAt"
        render={(createdAt) => dayjs(createdAt).format("YYYY-MM-DD HH:mm")}
      />
      <TableColumn
        title="Next Run At"
        dataIndex="nextRunAt"
        key="nextRunAt"
        render={(nextRunAt) =>
          nextRunAt ? dayjs(nextRunAt).format("YYYY-MM-DD HH:mm") : "N/A"
        }
      />
      <TableColumn
        title="Last Finished At"
        dataIndex="lastFinishedAt"
        key="lastFinishedAt"
        render={(lastFinishedAt) =>
          lastFinishedAt
            ? dayjs(lastFinishedAt).format("YYYY-MM-DD HH:mm")
            : "N/A"
        }
      />
      <TableColumn
        title="Failed At"
        dataIndex="failedAt"
        key="failedAt"
        render={(failedAt) =>
          failedAt ? dayjs(failedAt).format("YYYY-MM-DD HH:mm") : "N/A"
        }
      />
    </Table>
  );
};
