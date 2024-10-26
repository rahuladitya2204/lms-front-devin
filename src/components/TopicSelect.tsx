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

  // Deep clone the data to avoid mutation
  TOPIC_TREE_DATA = cloneDeep(TOPIC_TREE_DATA);

  // Function to update only title and description fields
  const updateTitleAndDescription = (nodes: any[]) => {
    nodes.forEach((node) => {
      if (node.title?.eng) node.title = node.title.eng;
      if (node.description?.eng) node.description = node.description.eng;

      // Recursively update child nodes, if any
      if (node.children?.length) {
        updateTitleAndDescription(node.children);
      }
    });
  };

  // Apply the title and description updates
  updateTitleAndDescription(TOPIC_TREE_DATA);

  // Optionally disable nodes if `notDisabled` is true
  if (props.notDisabled) {
    TOPIC_TREE_DATA.forEach((node) => {
      node.disabled = false;
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
