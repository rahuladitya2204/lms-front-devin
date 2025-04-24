import { useBuildTopicTree } from "@User/Screens/Tests/TestCreator/TestInformation/TestDetailsEditor/TestDetails";
import { Form, TreeSelect } from "antd";
import { cloneDeep } from "lodash";

export interface TopicSelectPropsI {
  name: string;
  label: string;
  topicId?: string | string[];
  level?: number;
  width: string;
  multiple?: boolean;
  notDisabled?: boolean;
  required?: boolean;
  defaultValue?: string | string[];  // ← NEW PROP
  onChange?: (value: string | string[]) => void;  // ← onChange handler
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
      if (props.notDisabled) {
        node.disabled = false;
      }
      if (typeof node.title === 'object') node.title = node.title.eng;
      if (typeof node.description === 'object') node.description = node.description.eng;

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
        style={{ width: props.width || 300 }}
        loading={isLoading}
        showSearch
        onChange={props.onChange}
        multiple={props.multiple}
        defaultValue={props.defaultValue}
        treeData={TOPIC_TREE_DATA}
        filterTreeNode={(input, node) =>
          (node?.title || "").toLowerCase().includes(input.toLowerCase())
        }
      />
    </Form.Item>
  );
}


/**
 * Function to get the full path of a node by topicId(s) in a tree data structure.
 * 
 * @param topicTreeData - The tree data containing nodes.
 * @param topicId - The key(s) of the node(s) to find the full path for.
 * @returns A string (if single topicId) or an array of strings (if multiple topicId).
 */
export const getFullTopicPath = (topicTreeData: any[], topicId: string | string[]): string | string[] => {
  console.log(topicTreeData, topicId, 12312312)
  const findNodeFullPath = (nodes: any[], id: string, path: string[] = []): string | null => {
    for (const node of nodes) {
      const currentPath = [...path, node.title]; // Append the current node title to the path
      if (node.key === id) {
        return currentPath.join("-"); // Return the path as a string
      }
      if (node.children?.length) {
        const childPath = findNodeFullPath(node.children, id, currentPath);
        if (childPath) return childPath; // Found the full path in children
      }
    }
    return null; // Node not found
  };

  if (Array.isArray(topicId)) {
    // Multiple topicId case
    return topicId.map((id) => findNodeFullPath(topicTreeData, id) || id); // Fallback to id if not found
  } else {
    // Single topicId case
    return findNodeFullPath(topicTreeData, topicId) || topicId; // Fallback to id if not found
  }
};
