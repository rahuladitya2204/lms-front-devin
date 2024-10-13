import { Button, Col, Row } from "antd";

import Container from "@Components/Container";
import Header from "@User/Screens/UserRoot/UserHeader";
import AffiliatesTable from "./AffiliatesTable";

import { User } from "@adewaskar/lms-common";

import { useModal } from "@Components/ActionModal/ModalContext";
import AddAffiliate from "./AddAffiliate";

function AffiliatesScreen() {
  const { data: learners, isFetching: loading } =
    User.Queries.useGetAffiliates();
  const { openModal } = useModal();
  return (
    <Header
      title={learners.length ? `Affiliates(${learners.length})` : "Affiliates"}
      extra={[
        <Button
          onClick={() => {
            // openModal(<AddAffiliate> </AddAffiliate>);
          }}
          type="primary"
        >
          Add Affiliate
        </Button>,
      ]}
    >
      <Container>
        <Row>
          <Col span={24}>
            <AffiliatesTable />
          </Col>
        </Row>
      </Container>
    </Header>
  );
}

export default AffiliatesScreen;
