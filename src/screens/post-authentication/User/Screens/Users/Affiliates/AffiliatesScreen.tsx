import { Button, Card, Col, DatePicker, Row } from "antd";

import Container from "@Components/Container";
import Header from "@User/Screens/UserRoot/UserHeader";
import AffiliatesTable from "./AffiliatesTable";

import { Types, User, Utils } from "@adewaskar/lms-common";

import { useModal } from "@Components/ActionModal/ModalContext";
import AddAffiliate from "./AddAffiliate";
import { useState } from "react";
import dayjs from "dayjs";
import { rangePresets } from "@Screens/post-authentication/Learner/Screens/Affiliate/AffiliateScreen";
import Table, { TableColumn } from "@Components/Table/TableComponent";

function AffiliatesScreen() {
  const { data: learners, isFetching: loading } =
    User.Queries.useGetAffiliates();
  const { openModal } = useModal();
  return (
    <Header
      title={learners.length ? `Affiliates(${learners.length})` : "Affiliates"}
      // extra={[
      //   <DatePicker.RangePicker
      //     presets={rangePresets}
      //     value={dates}
      //     onChange={setDates}
      //   />,
      // ]}
    >
      <Container>
        <Row>
          <Col span={24}>
            {/* <AffiliatesTable /> */}
            <AffiliatePayoutDetails />
          </Col>
        </Row>
      </Container>
    </Header>
  );
}

export default AffiliatesScreen;

interface AffiliatePayoutDetailsPropsI {
  affiliateId: string;
  dates: string[];
}

export const AffiliatePayoutDetails = ({}: // dates,
AffiliatePayoutDetailsPropsI) => {
  const [dates, setDates] = useState([dayjs().startOf("month"), dayjs()]);
  const { data: affiliates, isFetching: loading } =
    User.Queries.useGetAffiliates();
  const { data: payoutDetails, isLoading } =
    User.Queries.useGetAllAffiliatesPayoutDetails(dates);
  console.log(payoutDetails, "1111");
  return (
    <Card
      title={`Payout Details(${dayjs(dates[0]).format("LL")} - ${dayjs(
        dates[1]
      ).format("LL")})`}
      // extra={[
      //   <DatePicker.RangePicker
      //     presets={rangePresets}
      //     value={dates}
      //     onChange={setDates}
      //   />,
      // ]}
    >
      <Table
        extra={
          <DatePicker.RangePicker
            presets={rangePresets}
            value={dates}
            onChange={setDates}
          />
        }
        dataSource={payoutDetails.affiliates}
        // expandable={{
        //   expandedRowRender: (record) => (
        //     <Table dataSource={record.orders}>
        //       <TableColumn title="Order Id" dataIndex="orderId" />

        //       <TableColumn
        //         title="Date"
        //         dataIndex="date"
        //         render={(_: any, record: any) =>
        //           dayjs(record.date).format("LL")
        //         }
        //       />

        //       <TableColumn
        //         title="Commission"
        //         dataIndex="commission"
        //         render={(_: any, record: any) =>
        //           `${record.commissionValue}(${record.commissionType})`
        //         }
        //       />
        //     </Table>
        //   ),
        //   rowExpandable: (record) => record.name !== "Not Expandable",
        // }}
      >
        <TableColumn
          title="Affiliate Name"
          dataIndex="name"
          render={(_: any, record: Types.AffiliatePayoutDetails) =>
            record.learner.name
          }
        />

        <TableColumn
          title="Commission"
          dataIndex="commission"
          render={(_: any, record: Types.AffiliatePayoutDetails) =>
            Utils.UnitTypeToStr(record.totalCommission)
          }
        />

        <TableColumn
          title="Revenue"
          dataIndex="revenue"
          render={(_: any, record: Types.AffiliatePayoutDetails) =>
            Utils.UnitTypeToStr(record.totalRevenue)
          }
        />
      </Table>
    </Card>
  );
};
