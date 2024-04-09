import { Col, Row } from "antd";

import AppProvider from "screens/AppProvider";
import Header from "@Components/Header";
import { User } from "@adewaskar/lms-common";
import { useParams } from "@Router/index";

const TestEvaluator = () => {
  const { id: testID } = useParams();
  const { data: test } = User.Queries.useGetTestDetails(testID + "");
  return (
    <AppProvider>
      <Header title={`Test Evaluator: ${test.title}`}>
        <Row>
          <Col span={24}>12</Col>
        </Row>
      </Header>
    </AppProvider>
  );
};

export default TestEvaluator;
