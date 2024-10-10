import { Learner, Types, User, Utils } from "@adewaskar/lms-common";
import { Button, Col, List, Row, Skeleton, Tooltip } from "antd";
import { Text, Title } from "./Typography/Typography";
import { useModal } from "./ActionModal/ModalContext";
import { BookTwoTone } from "@ant-design/icons";
import { capitalize } from "lodash";

interface ShowSyllabusPropsI {
  testId: string;
}

export default function ShowSyllabus(props: ShowSyllabusPropsI) {
  const { data: test, isLoading: loadingTest } =
    Learner.Queries.useGetTestDetails(props.testId);
  const { data: treeData, isLoading: loadingTree } =
    Learner.Queries.useGetTopicTree(test.topics, 2);
  const showTooltip = treeData.length < 10;
  const { openModal } = useModal();
  const isLoading = loadingTest || loadingTree;

  const Component = (
    <Button
      loading={isLoading}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // if (!showTooltip) {
        openModal(
          <Row>
            <Col span={24}>
              <List
                itemLayout="vertical"
                dataSource={treeData}
                renderItem={(item) => {
                  return (
                    <Col style={{ marginBottom: 8 }} span={24}>
                      <Text>{item.title}</Text>
                    </Col>
                  );
                }}
              />
            </Col>
          </Row>,
          {
            title: `${test.title} Syllabus`,
          }
        );
        // }
      }}
      style={{ padding: 0, fontSize: 13 }}
      type="link"
    >
      <BookTwoTone />
      Show Syllabus
    </Button>
  );
  return Component;
}
