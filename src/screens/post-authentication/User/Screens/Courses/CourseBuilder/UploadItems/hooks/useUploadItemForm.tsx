import { useOutletContext, useParams } from "react-router";

import { Form } from "antd";
import { Types } from '@adewaskar/lms-common'
import { findSectionItem } from '@User/Screens/Courses/CourseBuilder/utils'
import { useEffect } from "react";

function useUploadItemForm() {
  const [form] = Form.useForm();
  let { itemId, sectionId } = useParams();


  const [sections, updateSections] = useOutletContext<[Types.CourseSection[],(sectionId:string,data:Types.CourseSectionItem)=>void]>();

  const item = findSectionItem(itemId+'', sectionId+'', sections) || {title:'',description:''};
  
  useEffect(() => {
    form.setFieldsValue(item)
  }, [item]);

  const onFormChange = (data:Partial<Types.CourseSectionItem>) => {
      const newItem = {
        ...item,
        ...data
      };

    updateSections(sectionId+'', newItem);
  }

  return { onFormChange,form,item };
  } 
  

export default useUploadItemForm;