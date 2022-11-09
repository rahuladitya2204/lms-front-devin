import { useOutletContext, useParams } from "react-router";

import { Form } from "antd";
import { findSectionItem } from "../../utils";
import { useEffect } from "react";
import { CourseSection, CourseSectionItem } from "../../../../../../../types/Courses.types";

function useUploadItemForm<T>(initialValues:T) {
  const [form] = Form.useForm();
  let { itemId, sectionId } = useParams();


  const [sections, updateSections] = useOutletContext<[CourseSection[],(sectionId:string,data:CourseSectionItem)=>void]>();

  const item = findSectionItem(itemId+'', sectionId+'', sections) || {title:'',description:''};
  
  useEffect(() => {
    form.setFieldsValue(item)
  }, [item]);

  const onFormChange = (data: { [key: string]: string }) => {
      const newItem = {
        ...item,
        ...data
      };

    updateSections(sectionId+'', newItem);
  }

  return { onFormChange,form,item };
  } 
  

export default useUploadItemForm;