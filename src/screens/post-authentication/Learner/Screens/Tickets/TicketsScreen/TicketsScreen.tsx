import { Button, Card, Col, Empty, Row, Skeleton, Space, Spin } from "antd";

import ActionModal from "@Components/ActionModal/ActionModal";
import CreateTicket from "../CreateTicket";
import { Learner } from "@adewaskar/lms-common";
import { Link } from "@Router/index";
import TicketItem from "./TicketItem";
import { useModal } from "@Components/ActionModal/ModalContext";

export default function TicketsScreen() {
  const {
    data: tickets,
    isLoading: loadingTicketsFirst,
    isFetching,
  } = Learner.Queries.useGetTickets();
  const { openModal } = useModal();
  if (loadingTicketsFirst) {
    return (
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Skeleton active />
        </Col>

        <Col span={24}>
          <Skeleton active />
        </Col>

        <Col span={24}>
          <Skeleton active />
        </Col>

        <Col span={24}>
          <Skeleton active />
        </Col>
      </Row>
    );
  }
  return tickets.length ? (
    <Spin spinning={isFetching}>
      <Space size={[20, 30]} style={{ width: "100%" }} direction="vertical">
        {tickets.map((ticket) => {
          return (
            <Link to={ticket._id + ""}>
              <TicketItem hideAttachments ticket={ticket} />
            </Link>
          );
        })}
      </Space>
    </Spin>
  ) : (
    <Card>
      <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{ height: 60 }}
        description={<span>No Tickets Found</span>}
      >
        <Button
          onClick={() => {
            openModal(<CreateTicket />);
          }}
          type="primary"
        >
          Create Now
        </Button>
        {/* <ActionModal cta={<Button type="primary">Create Now</Button>}>
          <CreateTicket />
        </ActionModal> */}
      </Empty>
    </Card>
  );
}
