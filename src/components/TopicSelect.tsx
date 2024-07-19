import { useBuildTopicTree } from "@User/Screens/Tests/TestCreator/TestInformation/TestDetailsEditor/TestDetails";
import { Form, TreeSelect } from "antd";

export interface TopicSelectPropsI {
  name: string;
  label: string;
  topicId?: string | string[];
  level?: number;
  multiple?: boolean;
  required?: boolean;
}
export default function TopicSelect(props: TopicSelectPropsI) {
  console.log(props.topicId, "oh yeyeyey");
  const TOPIC_TREE_DATA = useBuildTopicTree(props.topicId, props.level);
  return (
    <Form.Item name={props.name} label={props.label} required={props.required}>
      <TreeSelect multiple={props.multiple} treeData={TOPIC_TREE_DATA} />
    </Form.Item>
  );
}
