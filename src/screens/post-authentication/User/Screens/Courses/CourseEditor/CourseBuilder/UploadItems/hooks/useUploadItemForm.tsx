import { Constants, Types, User } from '@adewaskar/lms-common'
import { useOutletContext, useParams } from "react-router";

import { Form } from "antd";
import { FormInstance } from "antd/lib/form/Form";
import { findSectionItem } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import { useEffect } from "react";

function useUploadItemForm(form?:FormInstance) {
  let { itemId, id: courseId } = useParams();
  const {data: course}=User.Queries.useGetCourseDetails(courseId+'',{
    enabled:!!courseId
  });
  const { mutate: updateItem } = User.Queries.useUpdateCourseItem();

  const [items] = useOutletContext<[Types.CourseSection[],(sectionId:string,data:Types.CourseSectionItem)=>void,Function]>();
  const item = findSectionItem(itemId+'', items) || {title:'',description:''};
  const currentItemIndex = course.sections.map(s=>s.items).flat().findIndex(i => i._id === item._id);
  const section = course.sections.find(i => i.items[currentItemIndex]._id === item._id) || {_id:'',items:[],title:''}
  console.log(section,'section')
  useEffect(() => {
    if (form) {
      form.setFieldsValue(item)
    }
  }, [item]);

  const onFormChange = (data: Partial<Types.CourseSectionItem>) => {

      const newItem = {
        ...item,
        ...data
      };

    updateItem({
      courseId:courseId+'',
      sectionId:section._id+'',
      itemId: itemId+'',
      data: newItem,
      })
    // saveCourse();
  }

  return { onFormChange, form, item, sectionId: section._id, courseId, itemId,section,currentItemIndex };
  } 
  

export default useUploadItemForm;