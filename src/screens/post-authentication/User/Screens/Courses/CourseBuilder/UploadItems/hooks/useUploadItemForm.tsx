import { Types, User } from '@adewaskar/lms-common'
import { useOutletContext, useParams } from "react-router";

import { Form } from "antd";
import { FormInstance } from "antd/lib/form/Form";
import { findSectionItem } from '@User/Screens/Courses/CourseBuilder/utils'
import { useEffect } from "react";

function useUploadItemForm(form:FormInstance) {
  let { itemId, sectionId, id: courseId } = useParams();
  const { mutate: updateItem } = User.Queries.useUpdateCourseItem();

  const [sections] = useOutletContext<[Types.CourseSection[],(sectionId:string,data:Types.CourseSectionItem)=>void,Function]>();

  const item = findSectionItem(itemId+'', sectionId+'', sections) || {title:'',description:''};
  
  useEffect(() => {
    form.setFieldsValue(item)
  }, [item]);

  const onFormChange = (data: Partial<Types.CourseSectionItem>) => {

      const newItem = {
        ...item,
        ...data
      };

    updateItem({
      courseId:courseId+'',
      sectionId:sectionId+'',
      itemId: itemId+'',
      data: newItem
      })
    // saveCourse();
  }

  return { onFormChange, form, item,sectionId,courseId,itemId };
  } 
  

export default useUploadItemForm;