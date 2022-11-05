import { useOutletContext, useParams } from "react-router";

import { CourseSectionItem } from "../../../../../../types/Common.types";
import { Form } from "antd";
import { findNode } from "../../utils";
import { useEffect } from "react";

function useUploadItemForm<T>(initialValues:T) {
  const [form] = Form.useForm();
  let { nodeId } = useParams();
  if (!nodeId)
  {
    nodeId = '';
  }

  const [courseData, updateCourseData] = useOutletContext<[CourseSectionItem[],(data:CourseSectionItem)=>void]>();

  const node = findNode(nodeId, courseData);
  
  const data = node ? (node.data as T) : initialValues;

  useEffect(() => {
    form.setFieldsValue(data)
  }, [data]);

  const onFormChange = (key: string, value: string) => {
      const newData = {
        ...data,
        [key]: value
      };
      const updatedNode = {
        ...node,
        title: newData.title,
        data: newData
      };
      updateCourseData(updatedNode);
  }

  return { onFormChange,form,data };
  } 
  

export default useUploadItemForm;