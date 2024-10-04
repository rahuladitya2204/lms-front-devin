import { Learner, Types, User, Utils } from "@adewaskar/lms-common";
import { Button, Col, Row, Tooltip } from "antd";
import { Text } from "./Typography/Typography";
import { useModal } from "./ActionModal/ModalContext";
import { BookTwoTone } from "@ant-design/icons";
import { capitalize } from "lodash";

interface ShowSyllabusPropsI {
  testId: string;
}

export default function ShowSyllabus(props: ShowSyllabusPropsI) {
  const { data: test } = Learner.Queries.useGetTestDetails(props.testId);
  const { data: treeData } = Learner.Queries.useGetTopicTree(test.topics, 2);
  const showTooltip = treeData.length < 10;
  const { openModal } = useModal();
  // console.log(treeData, "treeData");
  const syllabusText = treeData.map((i) => capitalize(i.title)).join(", ");
  const Component = (
    <Button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // if (!showTooltip) {
        openModal(
          <Row>
            <Col span={24}>
              <Text>{syllabusText}</Text>
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
  //   return showTooltip ? (
  //     <Tooltip title={syllabusText}>{}</Tooltip>
  //   ) : (
  //     Component
  //   );
  return Component;
}
