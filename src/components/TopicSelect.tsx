import { useBuildTopicTree } from "@User/Screens/Tests/TestCreator/TestInformation/TestDetailsEditor/TestDetails";
import { Form, TreeSelect } from "antd";
import { cloneDeep } from "lodash";

export interface TopicSelectPropsI {
  name: string;
  label: string;
  topicId?: string | string[];
  level?: number;
  multiple?: boolean;
  notDisabled?: boolean;
  required?: boolean;
}
export default function TopicSelect(props: TopicSelectPropsI) {
  let { data: TOPIC_TREE_DATA, isLoading } = useBuildTopicTree(
    props.topicId || [],
    props.level,
    props.notDisabled
  );
  TOPIC_TREE_DATA = cloneDeep(TOPIC_TREE_DATA);

  if (props.notDisabled) {
    TOPIC_TREE_DATA.forEach((i) => {
      i.disabled = false;
    });
  }
  return (
    <Form.Item name={props.name} label={props.label} required={props.required}>
      <TreeSelect
        loading={isLoading}
        multiple={props.multiple}
        treeData={TOPIC_TREE_DATA}
      />
    </Form.Item>
  );
}
