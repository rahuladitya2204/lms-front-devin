import { Types, User } from '@adewaskar/lms-common'
import { useOutletContext, useParams } from "react-router";

import { FormInstance } from "antd/lib/form/Form";
import { debounce } from 'lodash';
import { findSectionItem } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import { useEffect } from "react";
import useMessage from '@Hooks/useMessage';

function useUploadItemForm(form?:FormInstance) {
  let { itemId, id: courseId } = useParams();
  const { data: course } = User.Queries.useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  });
  const message = useMessage();
  const { mutate: updateItemApi } = User.Queries.useUpdateCourseItem();
  const updateItem = debounce(updateItemApi, 300);
  const [items] = useOutletContext<[Types.CourseSection[],(sectionId:string,data:Types.CourseSectionItem)=>void,Function]>();
  const item:Types.CourseSectionItem = findSectionItem(itemId+'', items) || {title:'',description:''};
  const currentItemIndex = course.sections.map(s=>s.items).flat().findIndex(i => i._id === item?._id);
  const section = course.sections.find(section => {
    if (section.items.find(i => i._id === item._id)) {
      return section;
    }
  }) || {_id:'',items:[],title:''}

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
    }, {
      onSuccess: () => {
        message.open({
          type: 'success',
          content: `Saved`
        })
        }
      })
    // saveCourse();
  }
  // console.log(item,'item')
  return { onFormChange, form, item, sectionId: section._id, courseId, itemId,section,currentItemIndex };
  } 
  

export default useUploadItemForm;